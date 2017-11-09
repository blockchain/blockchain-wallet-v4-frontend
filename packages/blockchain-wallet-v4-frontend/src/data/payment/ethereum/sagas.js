import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors.js'

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
    console.log('sendEther')
  } catch (e) {
    yield put(actions.alerts.displayError('Could not send ether.'))
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

export const transferEther = function * (action) {
  try {
    const gasPrice = yield select(selectors.core.data.ethereum.getFeeRegular)
    const gasLimit = yield select(selectors.core.data.ethereum.getGasLimit)
    console.log('gasPrice', gasPrice)
    console.log('gasLimit', gasLimit)
    const { from, to, amount } = action.payload
    console.log(from, to, amount)
    const transaction = yield call(sagas.core.data.ethereum.buildTx, { from, to, amount, gasPrice, gasLimit })
    console.log(transaction)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not transfer ether.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_SEND_ETHER, initSendEther)
  yield takeEvery(AT.INIT_TRANSFER_ETHER, initTransferEther)
  yield takeLatest(AT.SEND_ETHER, sendEther)
  yield takeLatest(AT.TRANSFER_ETHER, transferEther)
}
