import { takeEvery, put, select } from 'redux-saga/effects'
import { formValueSelector, actions as reduxFormActions } from 'redux-form'
import bip21 from 'bip21'
import settings from 'config'
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
// ============================ MobileLogin Modal ==============================
// =============================================================================
const scanMobileLoginSuccess = function * (action) {
  const { payload } = action
  const { data } = payload
  yield put(actions.auth.mobileLoginSuccess(data))
}

const scanMobileLoginError = function * (action) {
  const { payload } = action
  yield put(actions.auth.mobileLoginError(payload))
}

const clickMobileLoginCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ========================= MobileNumberChange Modal ==========================
// =============================================================================

const clickMobileNumberChangeUpdate = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const mobileNumber = yield select(state => formValueSelector('mobileNumberChange')(state, 'mobileNumber'))
  yield put(actions.core.settings.updateMobile(guid, sharedKey, mobileNumber))
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
  yield put(actions.core.settings.verifyMobile(guid, sharedKey, code))
  yield put(actions.modals.closeAllModals())
}

const clickMobileNumberVerifyResend = function * (action) {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const mobileNumber = action.payload.mobileNumber
  yield put(actions.core.settings.updateMobile(guid, sharedKey, mobileNumber))
}

const clickMobileNumberVerifyChange = function * (action) {
  yield put(actions.modals.closeModal())
  yield put(actions.modals.showModal('MobileNumberChange'))
}

const clickMobileNumberVerifyCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ============================ PairingCode Modal ==============================
// =============================================================================
const initPairingCode = function * (action) {
  yield put(actions.modals.showModal('PairingCode', { data: action.payload.encryptionPhrase }))
}

// =============================================================================
// =============================== QRCode Modal ================================
// =============================================================================
const clickQRCodeCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ========================== QRCodeCapture Modal ==============================
// =============================================================================

const scanQRCodeCaptureSuccess = function * (action) {
  const { payload } = action
  const { data } = payload

  if (data) {
    const { address, options } = bip21.decode(data)
    const { amount, message } = options

    if (!address) {
      yield put(actions.alerts.displayError('An error occured when capturing the QRCode.'))
      return
    }
    yield put(reduxFormActions.change('sendBitcoin', 'to', address))
    if (!amount) {
      // const unit = yield select(selectors.core.settings.getBtcCurrency)
      // TODO: conversion here FFS
      yield put(reduxFormActions.change('sendBitcoin', 'amount', amount))
    }
    if (!message) {
      yield put(reduxFormActions.change('sendBitcoin', 'message', message))
    }
    yield put(actions.modals.closeModal())
  }
}

const scanQRCodeCaptureError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
  yield put(actions.modals.closeModal())
}

const clickQRCodeCaptureCancel = function * (action) {
  yield put(actions.modals.closeModal())
}

// =============================================================================
// =========================== RecoveryPhase Modal ============================
// =============================================================================
const clickRecoveryPhraseFinish = function * (action) {
  yield put(actions.core.wallet.verifyMnemonic())
  yield put(actions.modals.closeModal())
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
}

// =============================================================================
// =========================== RequestBitcoin Modal ============================
// =============================================================================
const clickRequestBitcoinQRCode = function * (action) {
  const { payload } = action
  const { receiveAddress } = payload
  yield put(actions.modals.showModal('QRCode', { address: receiveAddress }))
}

// =============================================================================
// ============================= SendBitcoin Modal =============================
// =============================================================================
const clickSendBitcoinSend = function * (action) {
  const { payload } = action
  const { selection } = payload
  yield put(actions.core.payment.signAndPublish(settings.NETWORK, selection))
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
    yield put(actions.modals.closeModal())
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
  yield put(actions.core.settings.updateAuthType(guid, sharedKey, 0))
  yield put(actions.modals.closeAllModals())
}

// =============================================================================
// ===================== TwoStepGoogleAuthenticator Modal ======================
// =============================================================================
const clickTwoStepGoogleAuthenticatorEnable = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const code = yield select(state => formValueSelector('twoStepGoogleAuthenticator')(state, 'code'))
  yield put(actions.core.settings.confirmGoogleAuthenticatorSetup(guid, sharedKey, code))
  yield put(actions.modals.closeAllModals())
}

// =============================================================================
// ============================ TwoStepYubico Modal ============================
// =============================================================================
const clickTwoStepYubicoEnable = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const code = yield select(state => formValueSelector('twoStepYubico')(state, 'code'))
  console.log(guid, sharedKey, code)
  // yield put(actions.core.settings..enableYubikey(guid, sharedKey, code)
}

// This saga listen if the Yubikey is successfully enabled on the server
const clickTwoStepYubicoEnableConfirmation = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  console.log(guid, sharedKey)
  // yield put(actions.core.settings.updateAuthType(guid, sharedKey, 2))
  // yield put(actions.modals.closeAllModals())
}

// =============================== EXPORT ======================================
function * sagas () {
  // AutoDisconnection
  yield takeEvery(AT.CLICK_AUTO_DISCONNECTION_LOGOUT, clickAutoDisconnectionLogout)
  yield takeEvery(AT.CLICK_AUTO_DISCONNECTION_CANCEL, clickAutoDisconnectionCancel)
  // MobileLogin
  yield takeEvery(AT.SCAN_MOBILE_LOGIN_SUCCESS, scanMobileLoginSuccess)
  yield takeEvery(AT.SCAN_MOBILE_LOGIN_ERROR, scanMobileLoginError)
  yield takeEvery(AT.CLICK_MOBILE_LOGIN_CANCEL, clickMobileLoginCancel)
  // MobileNumberChange
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_CHANGE_UPDATE, clickMobileNumberChangeUpdate)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_CHANGE_CANCEL, clickMobileNumberChangeCancel)
  // MobileNumberVerify
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_VALIDATE, clickMobileNumberVerifyValidate)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_RESEND, clickMobileNumberVerifyResend)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_CHANGE, clickMobileNumberVerifyChange)
  yield takeEvery(AT.CLICK_MOBILE_NUMBER_VERIFY_CANCEL, clickMobileNumberVerifyCancel)
  // PairingCode
  yield takeEvery(actionTypes.core.settings.REQUEST_PAIRING_CODE_SUCCESS, initPairingCode)
  // QRCode
  yield takeEvery(AT.CLICK_QRCODE_CANCEL, clickQRCodeCancel)
  // QRCodeCapture
  yield takeEvery(AT.SCAN_QRCODE_CAPTURE_SUCCESS, scanQRCodeCaptureSuccess)
  yield takeEvery(AT.SCAN_QRCODE_CAPTURE_ERROR, scanQRCodeCaptureError)
  yield takeEvery(AT.CLICK_QRCODE_CAPTURE_CANCEL, clickQRCodeCaptureCancel)
  // RecoveryPhrase
  yield takeEvery(AT.CLICK_RECOVERY_PHASE_FINISH, clickRecoveryPhraseFinish)
  // RequestBitcoin
  yield takeEvery(AT.CLICK_REQUEST_BITCOIN_QRCODE, clickRequestBitcoinQRCode)
  // sendBitcoin
  yield takeEvery(AT.CLICK_SEND_BITCOIN_SEND, clickSendBitcoinSend)
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
