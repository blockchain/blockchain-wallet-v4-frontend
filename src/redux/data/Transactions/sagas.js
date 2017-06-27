import { call, put, takeEvery, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'

import * as A from './actions'
import { Wrapper, Wallet } from '../../../types'
import { getTransactions } from './selectors'

export const transactionsSaga = ({ api, walletPath, dataPath } = {}) => {
  const loadTransactions = function * (action) {
    try {
      const { addressFilter, txPerPage } = action.payload
      const context = yield select(compose(Wallet.selectContext, Wrapper.selectWallet, prop(walletPath)))
      const currentTxs = yield select(compose(getTransactions, prop(dataPath)))
      const offset = currentTxs.length
      const data = yield call(api.fetchBlockchainData, context.toJS(), {n: txPerPage, onlyShow: addressFilter, offset: offset})
      yield put(A.loadContextTxs({addressFilter: addressFilter, txs: data.txs}))
    } catch (error) {
      // probably there is no context (blank wallet)
    }
  }

  return function * () {
    yield takeEvery(A.TXS_LOAD_REQUEST, loadTransactions)
  }
}
