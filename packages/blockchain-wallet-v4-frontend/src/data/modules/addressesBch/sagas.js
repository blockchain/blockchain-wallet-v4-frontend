import { takeEvery, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import { promptForInput } from 'services/SagaService'

export const editBchAccountLabel = function * (action) {
  try {
    const { index, label } = action.payload
    console.log(index, label)
    const newLabel = yield call(promptForInput, { title: 'Rename Bitcoin Cash Wallet', initial: label })
    yield put(actions.core.kvStore.bch.setAccountLabel(index, newLabel))
    yield put(actions.alerts.displaySuccess('BCH wallet name updated.'))
  } catch (e) {
    console.log('error in editBchAccountLabel generator')
  }
}

export const editBchHdLabel = function * (action) {
  try {
    let { accountIdx, addressIdx } = action.payload
    let newLabel = yield call(promptForInput, { title: 'Rename Address Label' })
    yield put(actions.core.kvStore.bch.setHdAddressLabel(accountIdx, addressIdx, newLabel))
    yield put(actions.alerts.displaySuccess('Address label updated.'))
  } catch (e) {
    console.log('error in editBchHdLabel generator')
  }
}

export default function * () {
  yield takeEvery(AT.EDIT_BCH_HD_LABEL, editBchHdLabel)
  yield takeEvery(AT.EDIT_BCH_ACCOUNT_LABEL, editBchAccountLabel)
}
