import { takeEvery, put, select } from 'redux-saga/effects'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import { actions, actionTypes, selectors } from 'data'
import * as AT from './actionTypes'

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
// =========================== RecoveryPhase Modal ============================
// =============================================================================
const clickRecoveryPhraseFinish = function * (action) {
  yield put(actions.core.wallet.verifyMnemonic())
  yield put(actions.modals.closeModal())
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
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
// ============================ TwoStepYubico Modal ============================
// =============================================================================

// This saga listen if the Yubikey is successfully enabled on the server
const clickTwoStepYubicoEnableConfirmation = function * () {
  const guid = yield select(selectors.core.wallet.getGuid)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  yield put(actions.core.settings.updateAuthType(guid, sharedKey, 1))
  yield put(actions.modals.closeAllModals())
}

// =============================== EXPORT ======================================
function * sagas () {
  // MobileLogin
  yield takeEvery(AT.SCAN_MOBILE_LOGIN_SUCCESS, scanMobileLoginSuccess)
  yield takeEvery(AT.SCAN_MOBILE_LOGIN_ERROR, scanMobileLoginError)
  yield takeEvery(AT.CLICK_MOBILE_LOGIN_CANCEL, clickMobileLoginCancel)
  // RecoveryPhrase
  yield takeEvery(AT.CLICK_RECOVERY_PHASE_FINISH, clickRecoveryPhraseFinish)
  // sendBitcoin
  yield takeEvery(AT.CLICK_SEND_BITCOIN_SEND, clickSendBitcoinSend)
 // TwoStepYubikey
  //yield takeEvery(actionTypes.core.settings.ENABLE_YUBIKEY_SUCCESS, clickTwoStepYubicoEnableConfirmation)
}

export default sagas
