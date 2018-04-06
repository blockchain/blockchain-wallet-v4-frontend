import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import { promptForInput } from 'services/SagaService'

export const editBchAccountLabel = function * (action) {
  try {
    const { index, label } = action.payload
    const newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Cash Wallet', initial: label })
    yield put(actions.core.kvStore.bch.setAccountLabel(index, newLabel))
    yield put(actions.alerts.displaySuccess('BCH wallet name updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('The Bitcoin Cash account label could not be updated.'))
  }
}

export const editBchHdLabel = function * (action) {
  try {
    let { accountIdx, addressIdx } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
    yield put(actions.core.kvStore.bch.setHdAddressLabel(accountIdx, addressIdx, newLabel))
    yield put(actions.alerts.displaySuccess('Address label updated.'))
  } catch (e) {
    yield put(actions.alerts.displayError('The Bitcoin Cash address label could not be updated.'))
  }
}

export default function * () {
  yield takeEvery(AT.EDIT_BCH_HD_LABEL, editBchHdLabel)
  yield takeEvery(AT.EDIT_BCH_ACCOUNT_LABEL, editBchAccountLabel)
}
