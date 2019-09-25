import { call, select } from 'redux-saga/effects'
import {
  isNil,
  mergeRight,
  prop,
  path,
  identity,
  indexOf,
  toLower
} from 'ramda'
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
import { FETCH_FEES_FAILURE } from '../model'

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

export default ({ api, securityModule }) => {
  const settingsSagas = settingsSagaFactory({ api })
  const selectIndex = function * (from) {
    const appState = yield select(identity)
    switch (prop('type', from)) {
      case ADDRESS_TYPES.ACCOUNT:
        return S.kvStore.eth
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

  const calculateSignature = function * (
    securityModule,
    network,
    transport,
    scrambleKey,
    p
  ) {
    switch (p.raw.fromType) {
      case ADDRESS_TYPES.ACCOUNT: {
        let sign
        if (p.isErc20) {
          const contractAddress = (yield select(
            S.kvStore.eth.getErc20ContractAddr,
            toLower(p.coin)
          )).getOrFail('missing_contract_addr')
          sign = data =>
            taskToPromise(
              eth.signErc20(network, securityModule, data, contractAddress)
            )
        } else {
          sign = data => taskToPromise(eth.sign(network, securityModule, data))
        }
        return yield call(sign, p.raw)
      }
      case ADDRESS_TYPES.LOCKBOX: {
        return yield call(
          eth.signWithLockbox,
          network,
          transport,
          scrambleKey,
          p.raw
        )
      }
    }
  }

  const calculateUnconfirmed = function * (type, address) {
    let latestTxS =
      type !== ADDRESS_TYPES.LOCKBOX
        ? S.kvStore.eth.getLatestTx
        : S.kvStore.lockbox.getLatestTxEth
    let latestTxTimestampS =
      type !== ADDRESS_TYPES.LOCKBOX
        ? S.kvStore.eth.getLatestTxTimestamp
        : S.kvStore.lockbox.getLatestTxTimestampEth

    const latestTxR = yield select(latestTxS, address)
    const latestTxTimestampR = yield select(latestTxTimestampS, address)
    const latestTx = latestTxR.getOrElse(undefined)
    const latestTxTimestamp = latestTxTimestampR.getOrElse(undefined)

    if (latestTx) {
      const ethOptionsR = yield select(S.walletOptions.getEthTxFuse)
      const lastTxFuse = ethOptionsR.getOrElse(86400) * 1000
      try {
        const latestTxStatus = yield call(api.getEthTransaction, latestTx)
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

  function create ({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = p => ({
      value () {
        return p
      },

      * init ({ isErc20, coin }) {
        let fees
        try {
          fees = yield call(api.getEthFees)
        } catch (e) {
          throw new Error(FETCH_FEES_FAILURE)
        }
        const gasPrice = prop('regular', fees)
        const gasLimit = isErc20
          ? prop('gasLimitContract', fees)
          : prop('gasLimit', fees)
        const fee = calculateFee(gasPrice, gasLimit)

        return makePayment(
          mergeRight(p, { fees, fee, feeInGwei: gasPrice, isErc20, coin })
        )
      },

      to (destination) {
        let to = calculateTo(destination)
        if (!EthUtil.isValidAddress(to.address)) {
          throw new Error('Invalid address')
        }
        return makePayment(mergeRight(p, { to: to }))
      },

      amount (amount) {
        return makePayment(mergeRight(p, { amount }))
      },

      * from (origin, type) {
        let account = origin
        if (isNil(origin) || origin === '') {
          const accountR = yield select(S.kvStore.eth.getDefaultAddress)
          account = accountR.getOrFail('missing_default_from')
        }
        const ethData = yield call(api.getEthBalances, account)
        const nonce = path([account, 'nonce'], ethData)
        let balance = p.isErc20
          ? (yield select(
              S.data.eth.getErc20Balance,
              toLower(p.coin)
            )).getOrFail('missing_erc20_balance')
          : path([account, 'balance'], ethData)

        const effectiveBalance = calculateEffectiveBalance(
          balance,
          prop('fee', p),
          prop('isErc20', p)
        )
        const from = {
          type: type || ADDRESS_TYPES.ACCOUNT,
          address: account,
          nonce
        }
        const unconfirmedTx = yield call(calculateUnconfirmed, type, account)

        return makePayment(
          mergeRight(p, { from, effectiveBalance, unconfirmedTx })
        )
      },

      * fee (value, origin) {
        let contract
        let account = origin
        if (origin === null || origin === undefined || origin === '') {
          const accountR = yield select(S.kvStore.eth.getDefaultAddress)
          account = accountR.getOrFail('missing_default_from')
        }
        if (p.isErc20) {
          contract = (yield select(
            S.kvStore.eth.getErc20ContractAddr,
            toLower(p.coin)
          )).getOrFail('missing_contract_addr')
        }
        // value can be in gwei or string ('regular' or 'priority')
        const fees = prop('fees', p)
        const feeInGwei =
          indexOf(value, ['regular', 'priority']) > -1 ? fees[value] : value

        const gasLimit = p.isErc20
          ? path(['fees', 'gasLimitContract'], p)
          : path(['fees', 'gasLimit'], p)
        const fee = calculateFee(feeInGwei, gasLimit)

        const data = p.isErc20
          ? yield call(api.getErc20Data, account, contract)
          : yield call(api.getEthBalances, account)

        const balancePath = p.isErc20
          ? path(['balance'])
          : path([account, 'balance'])

        const balance = balancePath(data)
        // balance + fee need to be in wei
        let effectiveBalance = calculateEffectiveBalance(
          balance,
          fee,
          p.isErc20
        )
        return makePayment(mergeRight(p, { feeInGwei, fee, effectiveBalance }))
      },

      * build () {
        const fromData = prop('from', p)
        const index = yield call(selectIndex, fromData)
        const to = path(['to', 'address'], p)
        const amount = prop('amount', p)
        const gasPrice = convertGweiToWei(prop('feeInGwei', p))
        const gasLimit = p.isErc20
          ? path(['fees', 'gasLimitContract'], p)
          : path(['fees', 'gasLimit'], p)
        const nonce = prop('nonce', fromData)
        const from = prop('address', fromData)
        const fromType = prop('type', fromData)
        if (isNil(from)) throw new Error('missing_from')
        if (!isValidIndex(index)) throw new Error('invalid_index')
        if (isNil(to)) throw new Error('missing_to')
        if (!isValidAddress(to)) throw new Error('invalid_to')
        if (isNil(amount)) throw new Error('missing_amount')
        if (isNil(gasPrice)) throw new Error('missing_gasprice')
        if (isNil(gasLimit)) throw new Error('missing_gaslimit')
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
        return makePayment(mergeRight(p, { raw }))
      },

      * sign (transport, scrambleKey) {
        const signed = yield call(
          calculateSignature,
          network,
          transport,
          scrambleKey,
          p
        )
        return makePayment(mergeRight(p, { signed }))
      },

      * signLegacy (secondPassword) {
        const signLegacy = data =>
          taskToPromise(
            eth.signLegacy(network, securityModule, secondPassword, data)
          )
        const signed = yield call(signLegacy, p.raw)
        return makePayment(mergeRight(p, { signed }))
      },

      * publish () {
        const signed = prop('signed', p)
        if (isNil(signed)) throw new Error('missing_signed_tx')
        const publish = () => api.pushEthTx(signed).then(prop('txHash'))
        const txId = yield call(publish)
        yield call(settingsSagas.setLastTxTime)
        return makePayment(mergeRight(p, { txId }))
      },

      fees (fees) {
        return makePayment(mergeRight(p, { fees }))
      },

      setIsContract (isContract) {
        return makePayment(mergeRight(p, { isContract }))
      },

      setIsErc20 (isErc20) {
        return makePayment(mergeRight(p, { isErc20 }))
      },

      setCoin (coin) {
        return makePayment(mergeRight(p, { coin }))
      },

      description (message) {
        return isString(message)
          ? makePayment(mergeRight(p, { description: message }))
          : makePayment(p)
      },

      chain () {
        const chain = (gen, f) =>
          makeChain(function * () {
            return yield f(yield gen())
          })

        const makeChain = gen => ({
          init: values => chain(gen, payment => payment.init(values)),
          to: address => chain(gen, payment => payment.to(address)),
          amount: amount => chain(gen, payment => payment.amount(amount)),
          from: (origin, type) =>
            chain(gen, payment => payment.from(origin, type)),
          fee: value => chain(gen, payment => payment.fee(value)),
          fees: fees => chain(gen, payment => payment.fees(fees)),
          build: () => chain(gen, payment => payment.build()),
          sign: password => chain(gen, payment => payment.sign(password)),
          publish: () => chain(gen, payment => payment.publish()),
          setIsErc20: val => chain(gen, payment => payment.setIsErc20(val)),
          setCoin: coin => chain(gen, payment => payment.setCoin(coin)),
          description: message =>
            chain(gen, payment => payment.description(message)),
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
