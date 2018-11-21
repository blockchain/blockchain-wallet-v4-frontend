import { call, select } from 'redux-saga/effects'
import { isNil, merge, prop, path, identity, indexOf } from 'ramda'
import EthUtil from 'ethereumjs-util'

import * as S from '../../selectors'
import { isValidIndex } from './utils'
import { eth } from '../../../signer'
import { isString, isPositiveInteger } from '../../../utils/checks'
import settingsSagaFactory from '../../../redux/settings/sagas'
import {
  calculateEffectiveBalance,
  isValidAddress,
  convertGweiToWei,
  calculateFee
} from '../../../utils/eth'
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

export default ({ api }) => {
  // ///////////////////////////////////////////////////////////////////////////
  const settingsSagas = settingsSagaFactory({ api })
  const selectIndex = function*(from) {
    const appState = yield select(identity)
    switch (prop('type', from)) {
      case ADDRESS_TYPES.ACCOUNT:
        return S.kvStore.ethereum
          .getAccountIndex(appState, prop('address', from))
          .getOrFail('Could not find ether account index')
      case ADDRESS_TYPES.LEGACY:
        return 1
    }
  }

  const calculateTo = destination => {
    if (!destination.type) {
      return { address: destination, type: ADDRESS_TYPES.ADDRESS }
    }

    return destination
  }

  const calculateSignature = function*(
    network,
    password,
    transport,
    scrambleKey,
    raw
  ) {
    switch (raw.fromType) {
      case ADDRESS_TYPES.ACCOUNT: {
        const appState = yield select(identity)
        const mnemonicT = S.wallet.getMnemonic(appState, password)
        const mnemonic = yield call(() => taskToPromise(mnemonicT))
        const sign = data => taskToPromise(eth.sign(network, mnemonic, data))
        return yield call(sign, raw)
      }
      case ADDRESS_TYPES.LOCKBOX: {
        return yield call(
          eth.signWithLockbox,
          network,
          transport,
          scrambleKey,
          raw
        )
      }
    }
  }

  const calculateUnconfirmed = function*(type, address) {
    let latestTxS =
      type !== ADDRESS_TYPES.LOCKBOX
        ? S.kvStore.ethereum.getLatestTx
        : S.kvStore.lockbox.getLatestTxEth
    let latestTxTimestampS =
      type !== ADDRESS_TYPES.LOCKBOX
        ? S.kvStore.ethereum.getLatestTxTimestamp
        : S.kvStore.lockbox.getLatestTxTimestampEth

    const latestTxR = yield select(latestTxS, address)
    const latestTxTimestampR = yield select(latestTxTimestampS, address)

    const latestTx = latestTxR.getOrElse(undefined)
    const latestTxTimestamp = latestTxTimestampR.getOrElse(undefined)

    if (latestTx) {
      const ethOptionsR = yield select(S.walletOptions.getEthTxFuse)
      const lastTxFuse = ethOptionsR.getOrElse(86400) * 1000
      try {
        const latestTxStatus = yield call(api.getEthereumTransaction, latestTx)
        if (
          !latestTxStatus.blockNumber &&
          latestTxTimestamp + lastTxFuse > Date.now()
        ) {
          return true
        }
      } catch (e) {
        if (latestTxTimestamp + lastTxFuse > Date.now()) {
          return true
        }
      }
    }
    return false
  }
  // ///////////////////////////////////////////////////////////////////////////

  function create ({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = p => ({
      value () {
        return p
      },

      *init () {
        const fees = yield call(api.getEthereumFee)
        const gasPrice = prop('regular', fees)
        const gasLimit = prop('gasLimit', fees)
        const fee = calculateFee(gasPrice, gasLimit)
        const feeInGwei = gasPrice

        return makePayment(merge(p, { fees, fee, feeInGwei }))
      },

      *to (destination) {
        let to = calculateTo(destination)
        if (!EthUtil.isValidAddress(to.address)) {
          throw new Error('Invalid address')
        }
        const isContract = yield call(api.checkContract, to.address)
        return makePayment(
          merge(p, { to: to, isContract: isContract.contract })
        )
      },

      amount (amount) {
        return makePayment(merge(p, { amount }))
      },

      *from (origin, type) {
        let account = origin
        if (origin === null || origin === undefined || origin === '') {
          const accountR = yield select(S.kvStore.ethereum.getDefaultAddress)
          account = accountR.getOrFail('missing_default_from')
        }
        // TODO :: check if origin is an account in your wallet
        const data = yield call(api.getEthereumBalances, account)
        const balance = path([account, 'balance'], data)
        const nonce = path([account, 'nonce'], data)
        const effectiveBalance = calculateEffectiveBalance(
          balance,
          prop('fee', p)
        )
        const from = {
          type: type || ADDRESS_TYPES.ACCOUNT,
          address: account,
          nonce
        }

        const unconfirmedTx = yield call(calculateUnconfirmed, type, account)

        return makePayment(merge(p, { from, effectiveBalance, unconfirmedTx }))
      },

      *fee (value, origin) {
        let account = origin
        if (origin === null || origin === undefined || origin === '') {
          const accountR = yield select(S.kvStore.ethereum.getDefaultAddress)
          account = accountR.getOrFail('missing_default_from')
        }
        // value can be in gwei or string ('regular' or 'priority')
        const fees = prop('fees', p)
        const feeInGwei =
          indexOf(value, ['regular', 'priority']) > -1 ? fees[value] : value
        const gasLimit = path(['fees', 'gasLimit'], p)
        const fee = calculateFee(feeInGwei, gasLimit)
        const data = yield call(api.getEthereumBalances, account)
        const balance = path([account, 'balance'], data)
        let effectiveBalance = calculateEffectiveBalance(
          // balance + fee need to be in wei
          balance,
          fee
        )
        return makePayment(merge(p, { feeInGwei, fee, effectiveBalance }))
      },

      *build () {
        const fromData = prop('from', p)
        const index = yield call(selectIndex, fromData)
        const to = path(['to', 'address'], p)
        const amount = prop('amount', p)
        const gasPrice = convertGweiToWei(prop('feeInGwei', p))
        const gasLimit = path(['fees', 'gasLimit'], p)
        const nonce = prop('nonce', fromData)
        const from = prop('address', fromData)
        const fromType = prop('type', fromData)
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
        const raw = {
          index,
          to,
          amount,
          gasPrice,
          gasLimit,
          nonce,
          from,
          fromType
        }
        return makePayment(merge(p, { raw }))
      },

      *sign (password, transport, scrambleKey) {
        try {
          const signed = yield call(
            calculateSignature,
            network,
            password,
            transport,
            scrambleKey,
            p.raw
          )
          return makePayment(merge(p, { signed }))
        } catch (e) {
          throw new Error('missing_mnemonic')
        }
      },

      *signLegacy (password) {
        try {
          const appState = yield select(identity)
          const seedHexT = S.wallet.getSeedHex(appState, password)
          const seedHex = yield call(() => taskToPromise(seedHexT))
          const signLegacy = data =>
            taskToPromise(eth.signLegacy(network, seedHex, data))
          const signed = yield call(signLegacy, p.raw)
          return makePayment(merge(p, { signed }))
        } catch (e) {
          throw new Error('missing_seed_hex')
        }
      },

      *publish () {
        const signed = prop('signed', p)
        if (isNil(signed)) throw new Error('missing_signed_tx')
        const publish = txHex => api.pushEthereumTx(signed).then(prop('txHash'))
        const txId = yield call(publish)
        yield call(settingsSagas.setLastTxTime)
        return makePayment(merge(p, { txId }))
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
          fee: value => chain(gen, payment => payment.fee(value)),
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
