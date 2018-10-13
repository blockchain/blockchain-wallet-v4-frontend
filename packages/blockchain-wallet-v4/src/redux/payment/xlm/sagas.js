import { call, select } from 'redux-saga/effects'
import { contains, flip, merge, prop, path, values } from 'ramda'

import * as S from '../../selectors'
import { xlm as xlmSigner } from '../../../signer'
import { isString, isPositiveInteger } from '../../../utils/checks'
import * as StellarSdk from 'stellar-sdk'
import { ADDRESS_TYPES } from '../btc/utils'

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

export const NO_ACCOUNT_ERROR = 'Account does not exist'
export const NO_LEDGER_ERROR = 'No ledger data'
export const NO_DEFAULT_ACCOUNT_ERROR = 'No default account'
export const INVALID_ADDRESS_TYPE_ERROR = 'Invalid address type'
export const INVALID_ADDRESS_ERROR = 'Invalid address'
export const INVALID_AMOUNT_ERROR = 'Invalid amount'
export const INSUFFICIENT_FUNDS_ERROR = 'Insufficient funds'
export const NO_DESTINATION_ERROR = 'No destination'
export const NO_AMMOUNT_ERROR = 'No amount'
export const NO_SOURCE_ERROR = 'No source account'
export const NO_TX_ERROR = 'No transaction'
export const NO_SIGNED_ERROR = 'No signed tx'

export default ({ api }) => {
  // ///////////////////////////////////////////////////////////////////////////
  const calculateTo = destination => {
    if (!destination.type) {
      return { address: destination, type: ADDRESS_TYPES.ADDRESS }
    }

    return destination
  }
  const getAccount = function*(accountId) {
    try {
      return yield call(api.getXlmAccount, accountId)
    } catch (e) {
      throw new Error(NO_ACCOUNT_ERROR)
    }
  }

  // ///////////////////////////////////////////////////////////////////////////

  function create ({ payment } = { payment: {} }) {
    const makePayment = p => ({
      value () {
        return p
      },

      *init () {
        const baseFee = (yield select(S.data.xlm.getBaseFee)).getOrFail(
          new Error(NO_LEDGER_ERROR)
        )
        const fee = baseFee * NUMBER_OF_OPERATIONS

        const effectiveBalance = (yield select(
          S.data.xlm.getBalance
        )).getOrFail(new Error(NO_DEFAULT_ACCOUNT_ERROR))

        return makePayment(merge(p, { fee, effectiveBalance }))
      },

      *from (origin, type) {
        const defaultAccountId = (yield select(
          S.kvStore.xlm.getDefaultAccountId
        )).getOrFail(new Error(NO_DEFAULT_ACCOUNT_ERROR))
        const accountId = origin || defaultAccountId
        const account =
          defaultAccountId === accountId
            ? (yield select(S.data.xlm.getAccount)).getOrFail(
                new Error(NO_DEFAULT_ACCOUNT_ERROR)
              )
            : yield call(getAccount, accountId)
        const fromType = type || ADDRESS_TYPES.ACCOUNT

        if (!contains(fromType, values(ADDRESS_TYPES)))
          throw new Error(INVALID_ADDRESS_TYPE_ERROR)

        const from = {
          type: fromType,
          address: accountId,
          account
        }
        return makePayment(merge(p, { from }))
      },

      to (destination) {
        if (!destination) throw new Error(NO_DESTINATION_ERROR)

        const to = calculateTo(destination)

        if (!contains(to.type, values(ADDRESS_TYPES)))
          throw new Error(INVALID_ADDRESS_TYPE_ERROR)
        if (!StellarSdk.StrKey.isValidEd25519PublicKey(to.address))
          throw new Error(INVALID_ADDRESS_ERROR)

        return makePayment(merge(p, { to }))
      },

      amount (amount) {
        if (!isPositiveInteger(amount)) throw new Error(INVALID_AMOUNT_ERROR)
        if (amount > p.effectiveBalance)
          throw new Error(INSUFFICIENT_FUNDS_ERROR)

        return makePayment(merge(p, { amount }))
      },

      fee () {
        return makePayment(p)
      },

      build () {
        const account = path(['from', 'account'], p)
        const to = path(['to', 'address'], p)
        const amount = prop('amount', p)
        const description = prop('description', p)
        if (!account) throw new Error(NO_SOURCE_ERROR)
        if (!to) throw new Error(NO_DESTINATION_ERROR)
        if (!amount) throw new Error(NO_AMMOUNT_ERROR)
        const txBuilder = new StellarSdk.TransactionBuilder(account)
        const paymentOperation = StellarSdk.Operation.payment({
          destination: to,
          asset: StellarSdk.Asset.native(),
          amount: String(amount)
        })
        txBuilder.addOperation(paymentOperation)
        if (description) txBuilder.addMemo(StellarSdk.Memo.text(description))
        const transaction = txBuilder.build()
        return makePayment(merge(p, { transaction }))
      },

      *sign (password) {
        const transaction = prop('transaction', p)
        if (!transaction) throw new Error(NO_TX_ERROR)
        const mnemonicT = yield select(flip(S.wallet.getMnemonic)(password))
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        const signed = xlmSigner.sign({ transaction }, mnemonic)
        return makePayment(merge(p, { signed }))
      },

      *publish () {
        const signed = prop('signed', p)
        if (!signed) throw new Error(NO_SIGNED_ERROR)
        const tx = yield call(api.pushXlmTx, signed)
        return makePayment(merge(p, { txId: tx.hash }))
      },

      description (message) {
        return isString(message)
          ? makePayment(merge(p, { description: message }))
          : makePayment(p)
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
