import { takeEvery, takeLatest, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'

export default ({ coreSagas }) => {
  const initTransferEther = function * (action) {
    try {
      const { balance } = action.payload
      yield put(actions.modals.closeAllModals())
      yield put(actions.modals.showModal('TransferEther', { balance }, { loading: true }))
      yield call(coreSagas.data.ethereum.fetchFee)
      yield put(actions.modals.updateModalOptions({ loading: false }))
    } catch (e) {
      yield put(actions.alerts.displayError('Could not init transfer ether.'))
    }
  }

  const transferEther = function * (action) {
    try {
      // const gasPrice = yield select(selectors.core.data.ethereum.getFeeRegular)
      // const gasLimit = yield select(selectors.core.data.ethereum.getGasLimit)
      // const legacyAccount = yield select(selectors.core.kvStore.ethereum.getLegacyAccount)
      // const accounts = yield select(selectors.core.kvStore.ethereum.getAccounts)
      // const defaultAccount = head(accounts)

      // const transaction = yield call(coreSagas.data.ethereum.buildTx, { from, to, amount, gasPrice, gasLimit })
    } catch (e) {
      yield put(actions.alerts.displayError('Could not transfer ether.'))
    }
  }

  return {
    initTransferEther,
    transferEther
  }
}
