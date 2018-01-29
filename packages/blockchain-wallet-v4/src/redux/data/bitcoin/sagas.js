import { call, put, select, spawn, cancel } from 'redux-saga/effects'
import {delay, takeEvery} from 'redux-saga'
import { futurizeP } from 'futurize'
import { equals, prop, is, compose } from 'ramda'
import Task from 'data.task'

import * as A from './actions'
import * as S from './selectors'
import * as wS from '../../wallet/selectors'
import { getCurrency } from '../../settings/selectors'
import { sign } from '../../../signer'
import * as Coin from '../../../coinSelection/coin'
import * as CoinSelection from '../../../coinSelection'
import {PUSH_TX} from './actionTypes'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api } = {}) => {
  const fetchFee = function * () {
    const response = yield call(api.getBitcoinFee)
    yield put(A.setBitcoinFee(response))
  }

  const fetchUnspent = function * (index, address) {
    const source = is(Number, index) ? index : address
    const wrapper = yield select(wS.getWrapper)
    try {
      const coins = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.setBitcoinUnspent(coins))
      return coins
    } catch (e) {
      yield put(A.setBitcoinUnspent([]))
      throw e
    }
  }

  const refreshSelection = function * ({ feePerByte, changeAddress, receiveAddress, satoshis, algorithm, seed }) {
    const coins = yield select(S.getCoins)
    const targetCoin = Coin.fromJS({ address: receiveAddress, value: satoshis })
    yield put(A.setBitcoinSelection(feePerByte, targetCoin, coins, changeAddress, algorithm, seed))
  }

  const refreshEffectiveBalance = function * ({ feePerByte }) {
    const coins = yield select(S.getCoins)
    const effectiveBalance = CoinSelection.effectiveBalance(feePerByte, coins).value
    yield put(A.setBitcoinEffectiveBalance(effectiveBalance))
  }

  const signAndPublish = function * ({ network, selection, password }) {
    const wrapper = yield select(wS.getWrapper)
    const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
    return yield call(signAndPublish, selection, password)
  }

  const pushTx = function * ({payload}) {
    let tx = payload.txHex
    return yield call(api.pushTx, tx)
  }

  const refreshRatesDelay = 600000
  let bitcoinRatesTask

  const refreshRates = function * () {
    while (true) {
      const response = yield call(api.getBitcoinTicker)
      yield put(A.setBitcoinRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  const startRates = function * () {
    bitcoinRatesTask = yield spawn(refreshRates)
  }

  const stopRates = function * () {
    yield cancel(bitcoinRatesTask)
  }

  const fetchTransactionFiatAtTime = function * ({ coin, hash, amount, time }) {
    const currency = yield select(getCurrency)
    const data = yield call(api.getTransactionFiatAtTime, coin, amount, currency, time)
    yield put(A.setBitcoinFiatAtTime(coin, currency, hash, data))
  }

  const fetchTransactions = function * ({ address }) {
    let reset = false
    const context = yield select(wS.getWalletContext)
    const currentAddress = yield select(S.getAddress)
    const currentTxs = yield select(S.getTransactions)
    if (!equals(currentAddress, address)) { reset = true }
    const offset = currentTxs.length
    const data = yield call(api.fetchBlockchainData, context, { n: 50, onlyShow: address, offset: offset })
    yield put(A.setBitcoinTransactions(address, data.txs, reset))
  }

  const sagas = function * () {
    yield takeEvery(PUSH_TX, pushTx)
  }

  return {
    fetchFee,
    fetchTransactions,
    fetchTransactionFiatAtTime,
    fetchUnspent,
    sagas,
    refreshSelection,
    refreshEffectiveBalance,
    signAndPublish,
    startRates,
    stopRates,
    pushTx
  }
}
