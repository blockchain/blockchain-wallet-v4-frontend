import { call, put, spawn, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { sum, values } from 'ramda'
import * as A from './actions'
import * as transactions from '../../../transactions'

export const ethereum = ({ api } = {}) => {
  const fetchBalance = function * ({ context }) {
    const response = yield call(api.getEthereumBalances, context)
    return sum(values(response).map(obj => obj.balance))
  }

  const fetchFee = function * () {
    const response = yield call(api.getEthereumFee)
    yield put(A.setEthereumFee(response))
  }

  const refreshRatesDelay = 600000
  let ethereumRatesTask

  const refreshRates = function * () {
    while (true) {
      const response = yield call(api.getEthereumTicker)
      yield put(A.setEthereumRates(response))
      yield call(delay, refreshRatesDelay)
    }
  }

  const startRates = function * () {
    ethereumRatesTask = yield spawn(refreshRates)
  }

  const stopRates = function * () {
    yield cancel(ethereumRatesTask)
  }

  const fetchTransactions = function * ({ address }) {
    const data = yield call(api.getEthereumData, address)
    yield put(A.setEthereumTransactions(address, data.txns))
  }

  const fetchLatestBlock = function * () {
    const data = yield call(api.getEthereumLatestBlock)
    yield put(A.setEthereumLatestBlock(data))
  }

  const buildTx = function * ({ fromAccount, toAddress, amount, gasPrice, gasLimit }) {
    console.log('buildTx', { fromAccount, toAddress, amount, gasPrice, gasLimit })
    return transactions.ethereum.createTx(fromAccount, toAddress, amount, gasPrice, gasLimit)
  }

  const pushTx = function * ({ transaction }) {
    // Serialize
    const rawTransaction = `0x${transaction.serialize().toString('hex')}`
    // Sign

    // Push
  }

  return {
    fetchBalance,
    fetchFee,
    startRates,
    stopRates,
    fetchTransactions,
    fetchLatestBlock,
    buildTx,
    pushTx
  }
}
