import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
// import { sendConfirmationCodeEmail } from './actions';

export const updateEmail = function * (action) {
  try {
    yield call(sagas.core.settings.setEmail, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully updated. Confirmation email has been sent.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update email address.'))
  }
}

export const verifyEmail = function * (action) {
  try {
    yield call(sagas.core.settings.setEmailVerified, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

export const sendConfirmationCodeEmail = function * (action) {
  try {
    yield call(sagas.core.settings.sendConfirmationCodeEmail, action.payload)
    yield put(actions.alerts.displaySuccess('Sent Confirmation Code Successfully.'))
  } catch (e) {
    console.warn(e)
    yield put(actions.alerts.displayError('Error sending confirmation code email.'))
  }
}

export const verifyEmailCode = function * (action) {
  try {
    console.log('verifyEmailCode', action)
    yield call(sagas.core.settings.verifyEmailCode, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

export default function * () {
  yield takeLatest(AT.UPDATE_EMAIL, updateEmail)
  yield takeLatest(AT.VERIFY_EMAIL, verifyEmail)
  yield takeLatest(AT.SEND_CONFIRMATION_CODE_EMAIL, sendConfirmationCodeEmail)
  yield takeLatest(AT.VERIFY_EMAIL_CODE, verifyEmailCode)
}
