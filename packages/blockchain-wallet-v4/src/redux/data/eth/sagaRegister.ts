import { fork, takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataEthSagas = sagas({ api })

  return function* coreDataEthSaga() {
    yield fork(dataEthSagas.watchTransactions)
    yield fork(dataEthSagas.watchErc20Transactions)
    yield takeLatest(AT.FETCH_ETH_DATA, dataEthSagas.fetchData)
    yield takeEvery(AT.FETCH_ERC20_TOKEN_DATA, dataEthSagas.fetchErc20Data)
    yield takeLatest(
      // @ts-ignore
      AT.FETCH_ETH_TRANSACTION_HISTORY,
      dataEthSagas.fetchTransactionHistory
    )
    yield takeLatest(AT.FETCH_ETH_LEGACY_BALANCE, dataEthSagas.fetchLegacyBalance)
    yield takeLatest(AT.FETCH_ETH_LATEST_BLOCK, dataEthSagas.fetchLatestBlock)
    yield takeLatest(AT.CHECK_LOW_ETH_BALANCE, dataEthSagas.checkForLowEthBalance)
    yield takeLatest(AT.FETCH_ERC20_TX_FEE, dataEthSagas.fetchErc20TransactionFee)
    yield takeLatest(AT.FETCH_ERC20_TRANSACTION_HISTORY, dataEthSagas.fetchErc20TransactionHistory)
  }
}
