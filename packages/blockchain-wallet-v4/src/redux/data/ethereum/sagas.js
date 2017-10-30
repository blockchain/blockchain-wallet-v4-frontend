import { call, put, spawn, cancel, delay } from 'redux-saga/effects'
import { sum, values } from 'ramda'
import * as A from './actions'

export const ethereum = ({ api } = {}) => {
  const fetchEtherBalance = function * ({ context }) {
    const response = yield call(api.getEtherBalances, context)
    const balance = sum(values(response).map(obj => obj.balance))
    yield put(A.setEtherBalance({ balance }))
  }
  const refreshRatesDelay = 600000
  let ethereumRatesTask

  const refreshEthereumRates = function * () {
    while (true) {
      const response = yield call(api.getEthereumTicker)
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

  const fetchEthereumTransactions = function * ({ address }) {
    const data = yield call(api.getEthereumData, address)
    yield put(A.setEthereumTransactions(address, data.txns))
  }

  return {
    fetchEtherBalance,
    startEthereumRates,
    stopEthereumRates,
    fetchEthereumTransactions
  }
}
