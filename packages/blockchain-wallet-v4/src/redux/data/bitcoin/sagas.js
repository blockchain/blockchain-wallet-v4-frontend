import { call, put, select, delay, spawn, cancel } from 'redux-saga/effects'
import { futurizeP } from 'futurize'
import { equals, prop, is, compose } from 'ramda'
import Task from 'data.task'

import { Wrapper, Wallet } from '../../../types'
import * as A from './actions'
import * as S from './selectors'
import { getCurrency } from '../../settings/selectors'
import { getCoins } from './selectors.js'
import { sign } from '../../../signer'
import * as Coin from '../../../coinSelection/coin'
import * as CoinSelection from '../../../coinSelection'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api, walletPath, dataPath, settingsPath } = {}) => {
  const fetchFee = function * () {
    const response = yield call(api.getFee)
    yield put(A.setFee(response))
  }

  const getUnspent = function * (index, address) {
    const source = is(Number, index) ? index : address
    const wrapper = yield select(prop(walletPath))
    try {
      const coins = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.setUnspent(coins))
    } catch (e) {
      yield put(A.setUnspent([]))
      throw e
    }
  }

  const refreshSelection = function * ({ feePerByte, changeAddress, receiveAddress, satoshis, algorithm, seed }) {
    const coins = yield select(compose(getCoins, prop(dataPath)))
    const targetCoin = Coin.fromJS({ address: receiveAddress, value: satoshis })
    yield put(A.setSelection(feePerByte, targetCoin, coins, changeAddress, algorithm, seed))
  }

  const refreshEffectiveBalance = function * ({ feePerByte }) {
    const coins = yield select(compose(getCoins, prop(dataPath)))
    const effectiveBalance = CoinSelection.effectiveBalance(feePerByte, coins).value
    yield put(A.setEffectiveBalance(effectiveBalance))
  }

  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(prop(walletPath))
    const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
    return yield call(signAndPublish, selection, password)
  }

  const refreshRatesDelay = 600000
  let bitcoinRatesTask

  const refreshBitcoinRates = function * () {
    while (true) {
      const response = yield call(api.getBitcoinTicker)
      yield put(A.setBitcoinRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  const startBitcoinRates = function * () {
    bitcoinRatesTask = yield spawn(refreshBitcoinRates)
  }

  const stopBitcoinRates = function * () {
    yield cancel(bitcoinRatesTask)
  }

  const fetchTransactionFiatAtTime = function * ({ coin, hash, amount, time }) {
    const currency = yield select(compose(getCurrency, prop(settingsPath)))
    const data = yield call(api.getTransactionFiatAtTime, coin, amount, currency, time)
    yield put(A.setTransactionFiatAtTime(coin, currency, hash, data))
  }

  const fetchBitcoinTransactions = function * ({ address }) {
    let reset = false
    const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
    const currentAddress = yield select(compose(S.getBitcoinAddress, prop(dataPath)))
    const currentTxs = yield select(compose(S.getBitcoinTransactions, prop(dataPath)))
    if (!equals(currentAddress, address)) { reset = true }
    const offset = currentTxs.length
    const data = yield call(api.fetchBlockchainData, context.toJS(), { n: 50, onlyShow: address, offset: offset })
    yield put(A.setBitcoinTransactions(address, data.txs, reset))
  }

  return {
    fetchFee,
    getUnspent,
    refreshSelection,
    refreshEffectiveBalance,
    signAndPublish,
    startBitcoinRates,
    stopBitcoinRates,
    fetchTransactionFiatAtTime,
    fetchBitcoinTransactions
  }
}
