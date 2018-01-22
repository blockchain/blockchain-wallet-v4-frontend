import { takeLatest, put, call } from 'redux-saga/effects'
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

export const sendEther = function * (action) {
  try {
  } catch (e) {
    yield put(actions.alerts.displayError('Could not send ether.'))
  }
}

export default function * () {
  yield takeLatest(AT.INIT_SEND_ETHER, initSendEther)
  yield takeLatest(AT.SEND_ETHER, sendEther)
}
