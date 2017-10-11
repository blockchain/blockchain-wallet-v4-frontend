import { delay } from 'redux-saga'
import { call, put, cancel, spawn } from 'redux-saga/effects'
import * as A from './actions'

export const ratesSaga = ({ api } = {}) => {
  // const refreshRatesDelay = 600000
  const refreshRatesDelay = 5000
  let bitcoinRatesTask, ethereumRatesTask

  const refreshBitcoinRates = function * () {
    while (true) {
      const response = yield call(api.getTicker)
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

  const refreshEthereumRates = function * () {
    while (true) {
      const response = yield call(api.getEthTicker)
      yield put(A.setEthereumRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  const startEthereumRates = function * () {
    ethereumRatesTask = yield spawn(refreshEthereumRates)
  }

  const stopEthereumRates = function * () {
    yield cancel(ethereumRatesTask)
  }

  return {
    startBitcoinRates,
    stopBitcoinRates,
    startEthereumRates,
    stopEthereumRates
  }
}
