import { takeEvery, put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const initSendEther = function * (action) {
  try {
    yield put(actions.modals.closeAllModals())
    yield put(actions.modals.showModal('SendEther', undefined, { loading: true }))
    yield call(sagas.core.data.ethereum.fetchFee)
    yield call(delay, 2000)
    yield put(actions.modals.updateModalOptions({ loading: false }))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init send ether.'))
  }
}

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

export default function * () {
  yield takeEvery(AT.INIT_SEND_ETHER, initSendEther)
  yield takeEvery(AT.INIT_TRANSFER_ETHER, initTransferEther)
}
