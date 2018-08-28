import { call, put, select } from 'redux-saga/effects'
import * as A from './actions'
import { getLockboxBtcContext } from '../../kvStore/lockbox/selectors'

export default ({ api }) => {
  const fetchBtcTransactions = function*(action) {
    try {
      const { payload } = action
      const { address, reset } = payload
      const TX_PER_PAGE = 10
      // const pages = yield select(S.getBtcTransactions)
      // const lastPage = last()
      // if (!reset && lastPage && lastPage.map(length).getOrElse(0) === 0) {
      //   return
      // }
      // const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      yield put(A.fetchBtcTransactionsLoading(reset))
      const contextR = yield select(getLockboxBtcContext)
      const context = contextR.getOrElse([])
      const data = yield call(api.fetchBlockchainData, context, {
        n: TX_PER_PAGE,
        onlyShow: address,
        offset: 0
      })
      yield put(A.fetchBtcTransactionsSuccess(data.txs, reset))
    } catch (e) {
      yield put(A.fetchBtcTransactionsFailure(e.message))
    }
  }

  return {
    fetchBtcTransactions
  }
}
