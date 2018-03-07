import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as A from './actions'
import * as sagas from '../../sagas.js'
import { actions } from 'data'
import * as selectors from '../../selectors.js'
import * as MODALS_ACTIONS from '../../modals/actions'

export const setBankManually = function * (action) { // will have to call this by dispatching action
  try {
    yield call(sagas.core.data.sfox.setBankManually, action.payload)
    yield put(actions.alerts.displaySuccess('Bank has been added!'))
  } catch (e) {
    console.warn(e)
    yield put(actions.alerts.displayError('Could not add bank. Please try again.'))
    // can dispatch an action here to set some kind of state
  }
}

export const sfoxSignup = function * () {
  try {
    yield call(sagas.core.data.sfox.signup)
    const profile = yield select(selectors.core.data.sfox.getProfile)

    if (!profile.error) {
      yield put(A.nextStep('verify'))
      yield put(actions.alerts.displaySuccess('Account successfully created!'))
    } else {
      yield put(A.signupFailure(profile.error))
    }
  } catch (e) {
    yield put(actions.alerts.displayError('Error creating account'))
  }
}

export const setProfile = function * (payload) {
  try {
    yield call(sagas.core.data.sfox.setProfile, payload)
    yield put(A.nextStep('upload'))
    yield put(actions.alerts.displaySuccess('Profile submitted successfully for verification!'))
  } catch (e) {
    yield put(actions.alerts.displayError('Error verifying profile'))
  }
}

export const upload = function * (payload) {
  try {
    yield call(sagas.core.data.sfox.uploadDoc, payload)

    const profile = yield select(selectors.core.data.sfox.getProfile)
    if (profile.data._verification_status.required_docs.length) {
      yield put(actions.alerts.displaySuccess('Document uploaded successfully!'))
    } else {
      yield put(actions.alerts.displaySuccess('Document uploaded successfully!'))
      yield put(A.nextStep('link'))
    }
  } catch (e) {
    yield put(actions.alerts.displayError('Error uploading'))
  }
}

export const setBank = function * (payload) {
  try {
    yield call(sagas.core.data.sfox.setBankAccount, payload)
    yield put(actions.alerts.displaySuccess('Bank account set successfully!'))
    yield put(MODALS_ACTIONS.closeAllModals())
  } catch (e) {
    yield put(actions.alerts.displayError('Error setting bank'))
  }
}

export default function * () {
  yield takeLatest(AT.SET_BANK_MANUALLY, setBankManually)
  yield takeLatest(AT.SET_BANK, setBank)
  yield takeLatest(AT.SIGNUP, sfoxSignup)
  yield takeLatest(AT.SET_PROFILE, setProfile)
  yield takeLatest(AT.UPLOAD, upload)
}
