import { call, select } from 'redux-saga/effects'
import { contains, flip, isNil, merge, prop, path, values } from 'ramda'
import * as StellarSdk from 'stellar-sdk'
import BigNumber from 'bignumber.js'

import * as S from '../../selectors'
import { xlm as xlmSigner } from '../../../signer'
import {
  isValidAddress,
  calculateEffectiveBalance,
  calculateFee,
  calculateReserve,
  overflowsFullBalance,
  overflowsEffectiveBalance
} from '../../../utils/xlm'
import { isString, isPositiveInteger } from '../../../utils/checks'
import { convertXlmToXlm } from '../../../exchange'
import { ADDRESS_TYPES } from '../btc/utils'
import settingsSagaFactory from '../../../redux/settings/sagas'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

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
export const NEW_ACCOUNT_ERROR = 'Not enough funds to create new account'
export const NO_DESTINATION_ERROR = 'No destination'
export const NO_AMOUNT_ERROR = 'No amount'
export const NO_SOURCE_ERROR = 'No source account'
export const NO_TX_ERROR = 'No transaction'
export const NO_SIGNED_ERROR = 'No signed tx'
export const WRONG_MEMO_FORMAT = 'Bad memo'

export default ({ api }) => {
  const settingsSagas = settingsSagaFactory({ api })
  // ///////////////////////////////////////////////////////////////////////////
  const calculateTo = destination => {
    if (!destination.type) {
      return { address: destination, type: ADDRESS_TYPES.ADDRESS }
    }

    return destination
  }

  const calculateSignature = function*(
    password,
    transaction,
    transport,
    scrambleKey,
    fromType
  ) {
    switch (fromType) {
      case ADDRESS_TYPES.ACCOUNT:
        if (!transaction) throw new Error(NO_TX_ERROR)
        const mnemonicT = yield select(flip(S.wallet.getMnemonic)(password))
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        return xlmSigner.sign({ transaction }, mnemonic)
      case ADDRESS_TYPES.LOCKBOX:
        return yield call(
          xlmSigner.signWithLockbox,
          transport,
          transaction,
          scrambleKey
        )
    }
  }

  const createOperation = (to, value, destinationAccountExists) => {
    const amount = convertXlmToXlm({
      value,
      fromUnit: 'STROOP',
      toUnit: 'XLM'
    }).value
    if (destinationAccountExists)
      return StellarSdk.Operation.payment({
        destination: to,
        asset: StellarSdk.Asset.native(),
        amount
      })

    return StellarSdk.Operation.createAccount({
      destination: to,
      startingBalance: amount
    })
  }

  const checkAccountExistance = function*(id) {
    try {
      yield call(api.getXlmAccount, id)
      return true
    } catch (e) {
      return false
    }
  }

  const getFee = function*() {
    const baseFee = (yield select(S.data.xlm.getBaseFee)).getOrFail(
      new Error(NO_LEDGER_ERROR)
    )
    return yield call(calculateFee, baseFee, NUMBER_OF_OPERATIONS)
  }

  const getReserve = function*(accountId) {
    const baseReserve = (yield select(S.data.xlm.getBaseReserve)).getOrFail(
      new Error(NO_LEDGER_ERROR)
    )
    const entriesNumber = (yield select(
      S.data.xlm.getNumberOfEntries(accountId)
    )).getOrFail(new Error(NO_ACCOUNT_ERROR))
    return yield call(calculateReserve, baseReserve, entriesNumber)
  }

  const getEffectiveBalance = function*(accountId, fee, reserve) {
    const balance = (yield select(S.data.xlm.getBalance(accountId))).getOrFail(
      new Error(NO_ACCOUNT_ERROR)
    )

    return calculateEffectiveBalance(balance, fee, reserve)
  }

  // Required when *build is called more than once on a payment
  const decrementSequenceNumber = (p, account) => {
    const sourceAccountSequence = prop('sequence', account)
    if (!prop('transaction', p) || isNil(sourceAccountSequence)) return account

    account._baseAccount.sequence = new BigNumber(sourceAccountSequence).minus(
      1
    )
    return account
  }

  // ///////////////////////////////////////////////////////////////////////////

  function create ({ payment } = { payment: {} }) {
    const makePayment = p => ({
      value () {
        return p
      },

      *init () {
        const fee = yield call(getFee)
        return makePayment(merge(p, { fee }))
      },

      *from (origin, type) {
        const accountId =
          origin ||
          (yield select(S.kvStore.xlm.getDefaultAccountId)).getOrFail(
            new Error(NO_DEFAULT_ACCOUNT_ERROR)
          )
        const account = (yield select(
          S.data.xlm.getAccount(accountId)
        )).getOrFail(new Error(NO_ACCOUNT_ERROR))
        const fromType = type || ADDRESS_TYPES.ACCOUNT

        if (!contains(fromType, values(ADDRESS_TYPES)))
          throw new Error(INVALID_ADDRESS_TYPE_ERROR)

        const from = {
          type: fromType,
          address: accountId,
          account
        }
        const reserve = yield call(getReserve, accountId)
        const effectiveBalance = yield call(
          getEffectiveBalance,
          accountId,
          p.fee,
          reserve
        )

        return makePayment(merge(p, { from, effectiveBalance, reserve }))
      },

      *to (destination) {
        if (!destination) throw new Error(NO_DESTINATION_ERROR)

        const to = calculateTo(destination)

        if (!contains(to.type, values(ADDRESS_TYPES)))
          throw new Error(INVALID_ADDRESS_TYPE_ERROR)
        if (!isValidAddress(to.address)) throw new Error(INVALID_ADDRESS_ERROR)

        const destinationAccountExists = yield call(
          checkAccountExistance,
          to.address
        )

        return makePayment(merge(p, { to, destinationAccountExists }))
      },

      amount (amount) {
        if (!isPositiveInteger(Number(amount)))
          throw new Error(INVALID_AMOUNT_ERROR)
        if (overflowsFullBalance(amount, p.effectiveBalance, p.reserve))
          throw new Error(INSUFFICIENT_FUNDS_ERROR)
        if (overflowsEffectiveBalance(amount, p.effectiveBalance))
          throw new Error(RESERVE_ERROR)

        return makePayment(merge(p, { amount }))
      },

      fee () {
        return makePayment(p)
      },

      *build () {
        const fromData = prop('from', p)
        const to = path(['to', 'address'], p)
        const amount = prop('amount', p)
        const destinationAccountExists = prop('destinationAccountExists', p)
        const memo = prop('memo', p)
        const memoType = prop('memoType', p)
        let account = prop('account', fromData)
        if (!account) throw new Error(NO_SOURCE_ERROR)
        if (!to) throw new Error(NO_DESTINATION_ERROR)
        if (!amount) throw new Error(NO_AMOUNT_ERROR)
        account = decrementSequenceNumber(p, account)
        const txBuilder = new StellarSdk.TransactionBuilder(account)
        const operation = yield call(
          createOperation,
          to,
          amount,
          destinationAccountExists
        )
        txBuilder.addOperation(operation)
        if (memo && memoType) {
          txBuilder.addMemo(StellarSdk.Memo[memoType](memo))
        }
        const transaction = txBuilder.build()
        return makePayment(merge(p, { transaction }))
      },

      *sign (password, transport, scrambleKey) {
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

      *publish () {
        const signed = prop('signed', p)
        if (!signed) throw new Error(NO_SIGNED_ERROR)
        const tx = yield call(api.pushXlmTx, signed)
        yield call(settingsSagas.setLastTxTime)
        return makePayment(merge(p, { txId: tx.hash }))
      },

      description (message) {
        return isString(message)
          ? makePayment(merge(p, { description: message }))
          : makePayment(p)
      },

      memo (memo) {
        if (!isString(memo)) throw new Error(WRONG_MEMO_FORMAT)

        return makePayment(merge(p, { memo }))
      },

      memoType (memoType) {
        if (!contains(memoType, MEMO_TYPES)) throw new Error(WRONG_MEMO_FORMAT)

        return makePayment(merge(p, { memoType }))
      },

      chain () {
        const chain = (gen, f) =>
          makeChain(function*() {
            return yield f(yield gen())
          })

        const makeChain = gen => ({
          init: () => chain(gen, payment => payment.init()),
          to: address => chain(gen, payment => payment.to(address)),
          amount: amount => chain(gen, payment => payment.amount(amount)),
          from: (origin, type) =>
            chain(gen, payment => payment.from(origin, type)),
          fee: () => chain(gen, payment => payment.fee()),
          build: () => chain(gen, payment => payment.build()),
          sign: password => chain(gen, payment => payment.sign(password)),
          publish: () => chain(gen, payment => payment.publish()),
          description: message =>
            chain(gen, payment => payment.description(message)),
          memo: memo => chain(gen, payment => payment.memo(memo)),
          memoType: memoType =>
            chain(gen, payment => payment.memoType(memoType)),
          *done () {
            return yield gen()
          }
        })

        return makeChain(function*() {
          return yield call(makePayment, p)
        })
      }
    })

    return makePayment(payment)
  }

  return {
    create: create
  }
}
