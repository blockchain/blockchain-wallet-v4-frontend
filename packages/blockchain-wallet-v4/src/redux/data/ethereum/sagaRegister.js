
import { fork, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataEthereumSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.FETCH_ETHEREUM_DATA, dataEthereumSagas.fetchData)
    yield takeLatest(AT.FETCH_ETHEREUM_FEE, dataEthereumSagas.fetchFee)
    yield takeLatest(AT.FETCH_ETHEREUM_LATEST_BLOCK, dataEthereumSagas.fetchLatestBlock)
    yield takeLatest(AT.FETCH_ETHEREUM_RATES, dataEthereumSagas.fetchRates)
    yield fork(dataEthereumSagas.watchTransactions)
  }
}
