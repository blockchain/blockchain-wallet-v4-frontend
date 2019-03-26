import { fork, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataEthSagas = sagas({ api })

  return function * coreDataEthSaga () {
    yield takeLatest(AT.FETCH_ETH_DATA, dataEthSagas.fetchData)
    yield takeLatest(AT.FETCH_ETH_RATES, dataEthSagas.fetchRates)
    yield fork(dataEthSagas.watchTransactions)
    yield takeLatest(
      AT.FETCH_ETH_LEGACY_BALANCE,
      dataEthSagas.fetchLegacyBalance
    )
    yield takeLatest(AT.FETCH_ETH_LATEST_BLOCK, dataEthSagas.fetchLatestBlock)
  }
}
