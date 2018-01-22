import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { head } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors.js'

export const initTransferEther = function * (action) {
  try {
    const { balance } = action.payload
    yield put(actions.modals.closeAllModals())
    yield put(actions.modals.showModal('TransferEther', { balance }, { loading: true }))
    yield call(sagas.core.data.ethereum.fetchFee)
    yield call(delay, 2000)
    yield put(actions.modals.updateModalOptions({ loading: false }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init transfer ether.'))
  }
}

export const transferEther = function * (action) {
  try {
    const gasPrice = yield select(selectors.core.data.ethereum.getFeeRegular)
    const gasLimit = yield select(selectors.core.data.ethereum.getGasLimit)
    const legacyAccount = yield select(selectors.core.kvStore.ethereum.getLegacyAccount)
    const accounts = yield select(selectors.core.kvStore.ethereum.getAccounts)
    const defaultAccount = head(accounts)

    // const transaction = yield call(sagas.core.data.ethereum.buildTx, { from, to, amount, gasPrice, gasLimit })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not transfer ether.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_TRANSFER_ETHER, initTransferEther)
  yield takeLatest(AT.TRANSFER_ETHER, transferEther)
}
