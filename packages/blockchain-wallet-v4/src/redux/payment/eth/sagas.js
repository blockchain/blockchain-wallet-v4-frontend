import { call, select } from 'redux-saga/effects'
import { merge, prop, path, map, identity } from 'ramda'
import Task from 'data.task'
import EthUtil from 'ethereumjs-util'

import * as S from '../../selectors'
// import { eth } from '../../../signer'
import { futurizeP } from 'futurize'
import { isString, isPositiveNumber, isPositiveInteger } from '../../../utils/checks'
import { calculateFee, calculateEffectiveBalance } from '../../../utils/ethereum'
// const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

/**
  Usage:
    // sequential
    let payment = create({ network })

    // chained
    let payment = yield create({ network })
      .chain().amount(myAmount).done()
*/

export default ({ api }) => {
  // ///////////////////////////////////////////////////////////////////////////
  // const pushEthereumTx = futurizeP(Task)(api.pushEthereumTx)
  // const getWalletUnspent = (network, fromData) =>
  //   api.getBitcoinUnspents(fromData.from, -1)
  //     .then(prop('unspent_outputs'))
  //     .then(map(toCoin(network, fromData)))
  
  // ///////////////////////////////////////////////////////////////////////////
  function create ({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = (p) => ({
      value () {
        return p
      },

      * init () {
        const fees = yield call(api.getEthereumFee)
        const gasPrice = prop('regular', fees)
        const gasLimit = prop('gasLimit', fees)
        const fee = calculateFee(gasPrice, gasLimit)
        return makePayment(merge(p, { fees, fee }))
      },

      to (destination) {
        if (!EthUtil.isValidAddress(destination)) {
          throw new Error('Invalid address')
        }
        return makePayment(merge(p, { to: destination }))
      },

      // * amount (amounts) {
      //   let amount = yield call(calculateAmount, amounts)
      //   return makePayment(merge(p, { amount }))
      // },

      * from (origin) {
        console.log('from', origin)
        let account = origin
        if (origin === null || origin === undefined || origin === '') {
          const accountR = (yield select(S.kvStore.ethereum.getDefaultAddress))
          account = accountR.getOrFail('missing_default_from')
        }
        console.log('account', account)
        // TODO :: check if origin is an account in your wallet
        const data = yield call(api.getEthereumBalances, account)
        const balance = path([account, 'balance'], data)
        const nonce = path([account, 'nonce'], data)
        console.log(balance)
        let effectiveBalance = calculateEffectiveBalance(balance, prop('fee', p))
        let from = {
          type: 'ACCOUNT',
          address: account,
          nonce
        }
        // let effectiveBalance = yield call(calculateEffectiveBalance, {coins, fee: p.fee})
        return makePayment(merge(p, { from, effectiveBalance }))
      },

      // * fee (value) {
      //   let fee = yield call(calculateFee, value, p.fees)
      //   let effectiveBalance = yield call(calculateEffectiveBalance, {coins: p.coins, fee})
      //   return makePayment(merge(p, { fee, effectiveBalance }))
      // },

      // * build () {
      //   let selection = yield call(calculateSelection, p)
      //   return makePayment(merge(p, { selection }))
      // },

      // * buildSweep () {
      //   let selection = yield call(calculateSweepSelection, p)
      //   return makePayment(merge(p, { selection }))
      // },

      // * sign (password) {
      //   let signed = yield call(calculateSignature, network, password, p.fromType, p.selection)
      //   return makePayment(merge(p, { ...signed }))
      // },

      // * publish () {
      //   let result = yield call(calculatePublish, p.txHex)
      //   return makePayment(merge(p, { result }))
      // },

      description (message) {
        return isString(message)
          ? makePayment(merge(p, { description: message }))
          : makePayment(p)
      },

      chain () {
        const chain = (gen, f) => makeChain(function * () {
          return yield f(yield gen())
        })

        const makeChain = (gen) => ({
          init: () => chain(gen, payment => payment.init()),
          to: (address) => chain(gen, payment => payment.to(address)),
          // amount: (amounts) => chain(gen, payment => payment.amount(amounts)),
          from: (origins) => chain(gen, payment => payment.from(origins)),
          // fee: (value) => chain(gen, payment => payment.fee(value)),
          // build: () => chain(gen, payment => payment.build()),
          // buildSweep: () => chain(gen, payment => payment.buildSweep()),
          // sign: (password) => chain(gen, payment => payment.sign(password)),
          // publish: () => chain(gen, payment => payment.publish()),
          description: (message) => chain(gen, payment => payment.description(message)),
          * done () {
            return yield gen()
          }
        })

        return makeChain(function * () {
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
