
import { takeEvery, call, put, select } from 'redux-saga/effects'
import { getTransactions } from '../selectors'
import * as A from '../actions'


// api should be promified api (no task for saga)
export const rootSaga = ({ dpath, wpath, api } = {}) => {
  // this should return an object with all the sagas and the api in the clojure
  // so you can decide which sagas you want to run
  const walletDataLoadSaga = function* (action) {
    try {
      const context = action.payload
      // we can handle api errors here
      const data = yield call(api.fetchBlockchainData, context, { n: 50 })
      yield put(A.loadWalletData(data))
      yield put(A.loadContextTxs(data))
    } catch (error) {
      // probably there is no context (blank wallet)
    }
  }

  const txsLoadRequestSaga = function* (action) {
    // NOTE: context must be a single address, for now
    const context = Array.isArray(action.payload) ? action.payload[0] : action.payload
    const currentTxs = yield select(getTransactions(dpath)(context))
    // we can handle api errors here
    const data = yield call(api.fetchBlockchainData, context, { n: 50, offset: currentTxs.size })
    yield put(A.loadContextTxs(data))

  }

  return function* () {
    yield takeEvery(A.WALLET_DATA_REQUEST, walletDataLoadSaga)
    yield takeEvery(A.TXS_LOAD_REQUEST, txsLoadRequestSaga)
  }
}
