import { contains, merge, path, prop, values } from 'ramda'
import { call, select } from 'redux-saga/effects'
import * as StellarSdk from 'stellar-sdk'

import { convertCoinToCoin } from '../../../exchange'
import { xlm as xlmSigner } from '../../../signer'
import { isPositiveInteger, isPositiveNumber, isString } from '../../../utils/checks'
import {
  calculateEffectiveBalance,
  calculateFee as utilsCalculateFee,
  calculateReserve,
  isValidAddress,
  overflowsEffectiveBalance,
  overflowsFullBalance
} from '../../../utils/xlm'
import * as S from '../../selectors'
import settingsSagaFactory from '../../settings/sagas'
import { ADDRESS_TYPES } from '../btc/utils'
import { AddressTypesType } from '../types'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

/**
  Usage:
    // sequential
    let payment = create({ network })

    // chained
    let payment = yield create({ network })
      .chain().amount(myAmount).done()
*/

// Number of payment operations, equals 1 for single destination payment:
export const NUMBER_OF_OPERATIONS = 1
export const MEMO_TYPES = ['id', 'text']

export const NO_ACCOUNT_ERROR = 'Account does not exist'
export const NO_LEDGER_ERROR = 'No ledger data'
export const NO_DEFAULT_ACCOUNT_ERROR = 'No default account'
export const INVALID_ADDRESS_TYPE_ERROR = 'Invalid address type'
export const INVALID_ADDRESS_ERROR = 'Invalid address'
export const INVALID_AMOUNT_ERROR = 'Invalid amount'
export const INSUFFICIENT_FUNDS_ERROR = 'Insufficient funds'
export const RESERVE_ERROR = 'Reserve exceeds remaining funds'
export const NO_DESTINATION_ERROR = 'No destination'
export const NO_AMOUNT_ERROR = 'No amount'
export const NO_SOURCE_ERROR = 'No source account'
export const NO_TX_ERROR = 'No transaction'
export const NO_SIGNED_ERROR = 'No signed tx'
export const WRONG_MEMO_FORMAT = 'Bad memo'

export default ({ api }) => {
  const settingsSagas = settingsSagaFactory({ api })
  // ///////////////////////////////////////////////////////////////////////////
  const calculateTo = (destination) => {
    if (!destination.type) {
      return { address: destination, type: ADDRESS_TYPES.ADDRESS }
    }

    return destination
  }

  const calculateSignature = function* (password, transaction, transport, scrambleKey, fromType) {
    switch (fromType) {
      case ADDRESS_TYPES.ACCOUNT:
        if (!transaction) throw new Error(NO_TX_ERROR)
        const mnemonicT = yield select(S.wallet.getMnemonic, password)
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        return yield call(xlmSigner.sign, { transaction }, mnemonic)
    }
  }

  const calculateFee = function* (fee, fees) {
    if (isPositiveNumber(fee)) {
      return yield call(utilsCalculateFee, fee, NUMBER_OF_OPERATIONS)
    }

    if (['regular', 'priority'].indexOf(fee) > -1) {
      return yield call(utilsCalculateFee, fees[fee], NUMBER_OF_OPERATIONS)
    }

    throw new Error('no_fee_set')
  }

  const createOperation = (to, value, destinationAccountExists) => {
    const amount = convertCoinToCoin({
      coin: 'XLM',
      value
    })
    if (destinationAccountExists)
      return StellarSdk.Operation.payment({
        amount,
        asset: StellarSdk.Asset.native(),
        destination: to
      })

    return StellarSdk.Operation.createAccount({
      destination: to,
      startingBalance: amount
    })
  }

  const getReserve = function* (accountId) {
    const baseReserve = (yield select(S.data.xlm.getBaseReserve)).getOrFail(
      new Error(NO_LEDGER_ERROR)
    )
    const entriesNumber = (yield select(S.data.xlm.getNumberOfEntries(accountId))).getOrFail(
      new Error(NO_ACCOUNT_ERROR)
    )
    return yield call(calculateReserve, baseReserve, entriesNumber)
  }

  const getEffectiveBalance = function* (accountId, fee, reserve) {
    const balance = (yield select(S.data.xlm.getBalance))(accountId).getOrFail(
      new Error(NO_ACCOUNT_ERROR)
    )

    return calculateEffectiveBalance(balance, fee, reserve)
  }

  // Required when *build is called more than once on a payment
  const getAccountAndSequenceNumber = function* (account) {
    try {
      const { id } = account
      const data = yield call(api.getXlmAccount, id)
      const { sequence } = data
      return new StellarSdk.Account(id, sequence)
    } catch (e) {
      throw new Error(e)
    }
  }

  // ///////////////////////////////////////////////////////////////////////////

  function create({ payment } = { payment: {} }) {
    const makePayment = (p) => ({
      amount(amount) {
        if (!isPositiveInteger(Number(amount))) throw new Error(INVALID_AMOUNT_ERROR)
        if (overflowsFullBalance(amount, p.effectiveBalance, p.reserve))
          throw new Error(INSUFFICIENT_FUNDS_ERROR)
        if (overflowsEffectiveBalance(amount, p.effectiveBalance)) throw new Error(RESERVE_ERROR)

        return makePayment(merge(p, { amount }))
      },

      *build() {
        const fromData = prop('from', p)
        const to = path(['to', 'address'], p)
        const amount = prop('amount', p)
        const fee = prop('fee', p)
        const destinationAccountExists = prop('destinationAccountExists', p)
        const memo = prop('memo', p)
        const memoType = prop('memoType', p)
        let account = prop('account', fromData)
        if (fromData.type === 'CUSTODIAL') return makePayment(p)
        if (!account) throw new Error(NO_SOURCE_ERROR)
        if (!to) throw new Error(NO_DESTINATION_ERROR)
        if (!amount) throw new Error(NO_AMOUNT_ERROR)
        account = yield call(getAccountAndSequenceNumber, account)
        const timeout = (yield select(S.walletOptions.getXlmSendTimeOutSeconds)).getOrElse(300)
        const timebounds = yield call(api.getTimebounds, timeout)
        const txBuilder = new StellarSdk.TransactionBuilder(account, {
          fee,
          networkPassphrase: StellarSdk.Networks.PUBLIC, // TODO: pass in app config to detect env and thus add testnet support
          timebounds
        })
        const operation = yield call(createOperation, to, amount, destinationAccountExists)
        txBuilder.addOperation(operation)
        if (memo && memoType) {
          txBuilder.addMemo(StellarSdk.Memo[memoType](memo))
        }
        const transaction = txBuilder.build()
        return makePayment(merge(p, { transaction }))
      },

      coin: 'XLM',

      description(message) {
        return isString(message) ? makePayment(merge(p, { description: message })) : makePayment(p)
      },

      *fee(value) {
        if (p.from && p.from.type === 'CUSTODIAL') {
          return makePayment(
            merge(p, {
              fee: value
            })
          )
        }

        const fee = yield call(calculateFee, value, prop('fees', p))
        return makePayment(merge(p, { fee }))
      },

      *from(origin, type: AddressTypesType, effectiveBalance?: string) {
        let from

        if (type === 'CUSTODIAL') {
          from = {
            address: origin,
            type
          }

          return makePayment(merge(p, { effectiveBalance, from }))
        }
        const accountId =
          origin ||
          (yield select(S.kvStore.xlm.getDefaultAccountId)).getOrFail(
            new Error(NO_DEFAULT_ACCOUNT_ERROR)
          )
        const account = (yield select(S.data.xlm.getAccount(accountId))).getOrFail(
          new Error(NO_ACCOUNT_ERROR)
        )
        const fromType = type || ADDRESS_TYPES.ACCOUNT

        if (!contains(fromType, values(ADDRESS_TYPES))) throw new Error(INVALID_ADDRESS_TYPE_ERROR)

        from = {
          account,
          address: accountId,
          type: fromType
        }
        const reserve = yield call(getReserve, accountId)
        effectiveBalance = yield call(getEffectiveBalance, accountId, p.fee, reserve)

        return makePayment(merge(p, { effectiveBalance, from, reserve }))
      },

      chain() {
        const chain = (gen, f) =>
          makeChain(function* () {
            return yield f(yield gen())
          })

        const makeChain = (gen) => ({
          amount: amount => chain(gen, payment => payment.amount(amount)),
          init: () => chain(gen, (payment) => payment.init()),
          fee: value => chain(gen, payment => payment.fee(value)),
          to: address => chain(gen, payment => payment.to(address)),
          build: () => chain(gen, (payment) => payment.build()),
          from: (origin, type) =>
            chain(gen, payment => payment.from(origin, type)),
          publish: () => chain(gen, (payment) => payment.publish()),
          description: (message) => chain(gen, (payment) => payment.description(message)),
          sign: password => chain(gen, payment => payment.sign(password)),
          memo: (memo) => chain(gen, (payment) => payment.memo(memo)),
          * done() {
            return yield gen()
          },
          memoType: (memoType) => chain(gen, (payment) => payment.memoType(memoType)),
          setDestinationAccountExists: (value) =>
            chain(gen, (payment) => payment.setDestinationAccountExists(value))
        })

        return makeChain(function* () {
          return yield call(makePayment, p)
        })
      },

      *init() {
        const fees = yield call(api.getXlmFees)
        const baseFee = prop('regular', fees)
        const fee = yield call(calculateFee, baseFee, fees)
        return makePayment(merge(p, { coin: 'XLM', fee, fees }))
      },

      memo(memo) {
        if (!isString(memo)) throw new Error(WRONG_MEMO_FORMAT)

        return makePayment(merge(p, { memo }))
      },

      memoType(memoType) {
        if (!contains(memoType, MEMO_TYPES)) throw new Error(WRONG_MEMO_FORMAT)

        return makePayment(merge(p, { memoType }))
      },

      *publish() {
        const signed = prop('signed', p)
        if (!signed) throw new Error(NO_SIGNED_ERROR)
        const tx = yield call(api.pushXlmTx, signed)
        yield call(settingsSagas.setLastTxTime)
        return makePayment(merge(p, { txId: tx.hash }))
      },

      value() {
        return p
      },

      setDestinationAccountExists(destinationAccountExists) {
        return makePayment(merge(p, { destinationAccountExists }))
      },

      *sign(password, transport, scrambleKey) {
        try {
          const transaction = prop('transaction', p)
          const signed = yield call(
            calculateSignature,
            password,
            transaction,
            transport,
            scrambleKey,
            path(['from', 'type'], p)
          )
          return makePayment(merge(p, { signed }))
        } catch (e) {
          throw new Error('missing_mnemonic')
        }
      },

      to(destination) {
        if (!destination) throw new Error(NO_DESTINATION_ERROR)

        const to = calculateTo(destination)

        if (!contains(to.type, values(ADDRESS_TYPES)))
          throw new Error(INVALID_ADDRESS_TYPE_ERROR)
        if (!isValidAddress(to.address)) throw new Error(INVALID_ADDRESS_ERROR)

        return makePayment(merge(p, { to }))
      }
    })

    return makePayment(payment)
  }

  return {
    create
  }
}
