import { call, put, takeEvery, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'

import * as A from './actions'
import * as T from './actionTypes'
import { Wrapper, Wallet } from '../../../types'
import { getTransactions } from './selectors'

export const transactionsSaga = ({ api, walletPath, dataPath } = {}) => {
  const fetchTransactions = function * (action) {
    try {
      const { addressFilter, txPerPage } = action.payload
      const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
      const currentTxs = yield select(compose(getTransactions, prop(dataPath)))
      const offset = currentTxs.length
      const data = yield call(api.fetchBlockchainData, context.toJS(), {n: txPerPage, onlyShow: addressFilter, offset: offset})
      yield put(A.fetchTransactionsSuccess({addressFilter: addressFilter, txs: data.txs}))
    } catch (error) {
      yield put(A.fetchTransactionsError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_TRANSACTIONS, fetchTransactions)
  }
}
