import { call, select } from 'redux-saga/effects'
import { isNil, merge, prop, path, identity } from 'ramda'
import EthUtil from 'ethereumjs-util'

import * as S from '../../selectors'
import { isValidIndex } from './utils'
import { eth } from '../../../signer'
import { isString, isPositiveInteger } from '../../../utils/checks'
import { calculateFee, calculateEffectiveBalance, isValidAddress, convertGweiToWei } from '../../../utils/ethereum'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

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
  const selectIndex = function * (from) {
    const appState = yield select(identity)
    switch (prop('type', from)) {
      case 'ACCOUNT':
        return S.kvStore.ethereum.getAccountIndex(appState, prop('address', from)).getOrFail('Could not find ether account index')
      case 'LEGACY':
        return 0
    }
  }
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

      amount (amount) {
        return makePayment(merge(p, { amount }))
      },

      * from (origin) {
        let account = origin
        if (origin === null || origin === undefined || origin === '') {
          const accountR = (yield select(S.kvStore.ethereum.getDefaultAddress))
          account = accountR.getOrFail('missing_default_from')
        }
        // TODO :: check if origin is an account in your wallet
        const data = yield call(api.getEthereumBalances, account)
        const balance = path([account, 'balance'], data)
        const nonce = path([account, 'nonce'], data)

        const effectiveBalance = calculateEffectiveBalance(balance, prop('fee', p))
        const from = {
          type: 'ACCOUNT',
          address: account,
          nonce
        }
        // let effectiveBalance = yield call(calculateEffectiveBalance, {coins, fee: p.fee})
        return makePayment(merge(p, { from, effectiveBalance }))
      },

      * build () {
        const from = prop('from', p)
        const index = yield call(selectIndex, from)
        const to = prop('to', p)
        const amount = prop('amount', p)
        const gasPrice = convertGweiToWei(path(['fees', 'regular'], p))
        const gasLimit = path(['fees', 'gasLimit'], p)
        const nonce = prop('nonce', from)
        if (isNil(from)) throw new Error('missing_from')
        if (!isValidIndex(index)) throw new Error('invalid_index')
        if (isNil(to)) throw new Error('missing_to')
        if (!isValidAddress(to)) throw new Error('invalid_to')
        if (isNil(amount)) throw new Error('missing_amount')
        if (isNil(gasPrice)) throw new Error('missing_gasprice')
        // if (!isPositiveInteger(gasPrice)) throw new Error('invalid_gasprice')
        if (isNil(gasLimit)) throw new Error('missing_gaslimit')
        // if (!isPositiveInteger(gasLimit)) throw new Error('invalid_gaslimit')
        if (isNil(nonce)) throw new Error('missing_nonce')
        if (!isPositiveInteger(nonce)) throw new Error('invalid_nonce')
        const raw = { index, to, amount, gasPrice, gasLimit, nonce }
        return makePayment(merge(p, { raw }))
      },

      * sign (password) {
        const appState = yield select(identity)
        const eitherMnemonic = S.wallet.getMnemonic(appState, password)
        if (eitherMnemonic.isLeft) throw new Error('missing_mnemonic')
        const mnemonic = eitherMnemonic.value
        const sign = data => taskToPromise(eth.sign(network, mnemonic, data))
        const signed = yield call(sign, p.raw)

        return makePayment(merge(p, { signed }))
      },

      * publish () {
        const signed = prop('signed', p)
        if (isNil(signed)) throw new Error('missing_signed_tx')
        const publish = txHex => api.pushEthereumTx(signed).then(prop('txHash'))
        const hash = yield call(publish)

        return makePayment(merge(p, { hash }))
      },

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
          amount: (amount) => chain(gen, payment => payment.amount(amount)),
          from: (origin) => chain(gen, payment => payment.from(origin)),
          build: () => chain(gen, payment => payment.build()),
          sign: (password) => chain(gen, payment => payment.sign(password)),
          publish: () => chain(gen, payment => payment.publish()),
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
