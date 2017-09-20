import { takeEvery, put, select } from 'redux-saga/effects'
import { formValueSelector } from 'redux-form'
import { actions, actionTypes, selectors } from 'data'
import * as AT from './actionTypes'

// =============================================================================
// ========================= AutoDisconnection Modal ===========================
// =============================================================================

const clickAutoDisconnectionLogout = function * (action) {
  yield put(actions.auth.logoutStart())
  yield put(actions.modals.closeModal())
}

const clickAutoDisconnectionCancel = function * (action) {
  yield put(actions.auth.logoutResetTimer())
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ========================= MobileNumberChange Modal ==========================
// =============================================================================

const clickMobileNumberChangeUpdate = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const mobileNumber = yield select(state => formValueSelector('mobileNumberChange')(state, 'mobileNumber'))
  yield put(actions.settings.updateMobile(guid, sharedKey, mobileNumber))
  yield put(actions.modals.closeModal())
  yield put(actions.modals.showModal('MobileNumberVerify', { mobileNumber }))
}

const clickMobileNumberChangeCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ========================= MobileNumberVerify Modal ==========================
// =============================================================================
const clickMobileNumberVerifyValidate = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const code = yield select(state => formValueSelector('mobileNumberVerify')(state, 'code'))
  yield put(actions.settings.verifyMobile(guid, sharedKey, code))
  yield put(actions.modals.closeModal())
}

const clickMobileNumberVerifyResend = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const mobileNumber = action.payload.mobileNumber
  yield put(actions.settings.updateMobile(guid, sharedKey, mobileNumber))
}

const clickMobileNumberVerifyChange = function * (action) {
  yield put(actions.modals.closeModal())
  yield put(actions.modals.showModal('MobileNumberChange'))
}

const clickMobileNumberVerifyCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ============================ PairingCode modal ==============================
// =============================================================================
const initPairingCode = function * (action) {
  yield put(actions.modals.showModal('PairingCode', { data: action.payload.encryptionPhrase }))
}

// =============================================================================
// ============================ TwoStepSetup Modal =============================
// =============================================================================
const clickTwoStepSetupMobile = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const smsNumber = yield select(selectors.core.settings.getSmsNumber)
  const smsVerified = yield select(selectors.core.settings.getSmsVerified)

  if (!smsNumber) {
    yield put(actions.modals.showModal('MobileNumberChange'))
  } else if (!smsVerified) {
    yield put(actions.modals.showModal('MobileNumberVerify', { mobileNumber: smsNumber }))
  } else {
    yield put(actions.core.settings.updateAuthType(guid, sharedKey, 5))
  }
}

const clickTwoStepSetupGoogleAuthenticator = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  yield put(actions.core.settings.getGoogleAuthenticatorSecretUrl(guid, sharedKey))
}

const clickTwoStepSetupYubico = function * (action) {
  yield put(actions.modals.showModal('TwoStepYubico'))
}

const clickTwoStepSetupDisable = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  yield put(actions.settings.updateAuthType(guid, sharedKey, 0))
}

// =============================================================================
// ===================== TwoStepGoogleAuthenticator Modal ======================
// =============================================================================
const clickTwoStepGoogleAuthenticatorEnable = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const code = yield select(state => formValueSelector('twoStepGoogleAuthenticator')(state, 'code'))

  this.props.settingsActions.confirmGoogleAuthenticatorSetup(guid, sharedKey, code)
}

// =============================================================================
// ============================ TwoStepYubico Modal ============================
// =============================================================================
const clickTwoStepYubicoEnable = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const code = yield select(state => formValueSelector('twoStepYubico')(state, 'code'))

  console.log(guid, sharedKey, code)
  // this.props.settingsActions.enableYubikey(guid, sharedKey, code)
}

// This saga listen if the Yubikey is successfully enabled on the server
const clickTwoStepYubicoEnableConfirmation = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  console.log(guid, sharedKey)
  // yield put(actions.settings.updateAuthType(guid, sharedKey, 2))
}

// =============================== EXPORT ======================================

function * sagas () {
  // AutoDisconnection
  yield takeEvery(AT.CLICK_AUTO_DISCONNECTION_LOGOUT, clickAutoDisconnectionLogout)
  yield takeEvery(AT.CLICK_AUTO_DISCONNECTION_CANCEL, clickAutoDisconnectionCancel)
  // MobileNumberChange
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_CHANGE_UPDATE, clickMobileNumberChangeUpdate)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_CHANGE_CANCEL, clickMobileNumberChangeCancel)
  // MobileNumberVerify
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_VALIDATE, clickMobileNumberVerifyValidate)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_RESEND, clickMobileNumberVerifyResend)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_CHANGE, clickMobileNumberVerifyChange)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_CANCEL, clickMobileNumberVerifyCancel)
  // PairingCode
  yield takeEvery(actionTypes.core.settings.requestPairingCodeSuccess, initPairingCode)
  // TwoStepSetup
  yield takeEvery(AT.CLICK_TWO_STEP_SETUP_MOBILE, clickTwoStepSetupMobile)
  yield takeEvery(AT.CLICK_TWO_STEP_SETUP_GOOGLE_AUTHENTICATOR, clickTwoStepSetupGoogleAuthenticator)
  yield takeEvery(AT.CLICK_TWO_STEP_SETUP_YUBICO, clickTwoStepSetupYubico)
  yield takeEvery(AT.CLICK_TWO_STEP_SETUP_DISABLE, clickTwoStepSetupDisable)
  // TwoStepGoogleAuthenticator
  yield takeEvery(AT.CLICK_TWO_STEP_GOOGLE_AUTHENTICATOR_ENABLE, clickTwoStepGoogleAuthenticatorEnable)
  // TwoStepYubikey
  yield takeEvery(AT.CLICK_TWO_STEP_YUBICO_ENABLE, clickTwoStepYubicoEnable)
  yield takeEvery(actionTypes.core.settings.ENABLE_YUBIKEY_SUCCESS, clickTwoStepYubicoEnableConfirmation)
}

export default sagas
