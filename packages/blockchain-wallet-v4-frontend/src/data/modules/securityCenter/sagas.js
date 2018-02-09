import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
// import { sendConfirmationCodeEmail } from './actions';

export const updateEmail = function * (action) {
  try {
    yield call(sagas.core.settings.setEmail, action.payload)
    yield put(actions.alerts.displaySuccess('Your email has been updated. An email with your confirmation code has been sent.'))
    // TODO: I believe the backend should do this next step
    yield call(sagas.core.settings.sendConfirmationCodeEmail, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not update email address.'))
  }
}

const getGoogleAuthenticatorSecretUrl = function * (action) {
  try {
    console.log('#1 getGoogleAuthSecret frontend saga', action)
    const googleAuthenticatorSecretUrl = yield call(sagas.core.settings.requestGoogleAuthenticatorSecretUrl)
    console.log('frontend sagas: getGoogleAuthSecretUrl', googleAuthenticatorSecretUrl)
    return googleAuthenticatorSecretUrl
    // yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl }))
  } catch (e) {
    console.warn('frontend saga catch', e)
    yield put(actions.alerts.displayError('Could not fetch google authenticator secret.'))
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
    yield put(actions.alerts.displayError('Error sending confirmation code email.'))
  }
}

export const verifyEmailCode = function * (action) {
  try {
    yield call(sagas.core.settings.verifyEmailCode, action.payload)
    yield put(actions.alerts.displaySuccess('Email address has been successfully verified.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify email address.'))
  }
}

export const verifyGoogleAuthenticator = function * (action) {
  try {
    yield call(sagas.core.settings.setGoogleAuthenticator, action.payload)
    yield put(actions.alerts.displaySuccess('Google auth verified!'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify google auth code.'))
  }
}

export const setYubikey = function * (action) {
  try {
    yield call(sagas.core.settings.setYubikey, action.payload)
    yield put(actions.alerts.displaySuccess('Yubikey verified!'))
  } catch (e) {
    yield put(actions.alerts.displayError('Could not verify yubikey.'))
  }
}

export default function * () {
  yield takeLatest(AT.UPDATE_EMAIL, updateEmail)
  yield takeLatest(AT.VERIFY_EMAIL, verifyEmail)
  yield takeLatest(AT.SEND_CONFIRMATION_CODE_EMAIL, sendConfirmationCodeEmail)
  yield takeLatest(AT.VERIFY_EMAIL_CODE, verifyEmailCode)
  yield takeLatest(AT.GET_GOOGLE_AUTHENTICATOR_SECRET_URL, getGoogleAuthenticatorSecretUrl)
  yield takeLatest(AT.VERIFY_GOOGLE_AUTHENTICATOR, verifyGoogleAuthenticator)
  yield takeLatest(AT.SET_YUBIKEY, setYubikey)
}
