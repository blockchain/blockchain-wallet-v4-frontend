import { takeEvery, put } from 'redux-saga/effects'
import { actions as reduxFormActions } from 'redux-form'
import { push } from 'react-router-redux'
import { actions, actionTypes } from 'data'

// =============================================================================
// =============================== SendBitcoin =================================
// =============================================================================

const signAndPublishSuccess = function * (action) {
  yield put(reduxFormActions.destroy('sendBitcoin'))
  yield put(actions.modals.closeModal())
  yield put(push('/transactions'))
  yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
}

const signAndPublishError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

// =============================================================================
// ============================== Mobile number ================================
// =============================================================================

const updateMobileSuccess = function * (action) {
  const { payload } = action
  const { data } = payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateMobileError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

const verifyMobileSuccess = function * (action) {
  const { payload } = action
  const { data } = payload
  yield put(actions.alerts.displaySuccess(data))
}

const verifyMobileError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

// =============================================================================
// ================================= Language ==================================
// =============================================================================
const updateLanguageSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateLanguageError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ================================= Currency ==================================
// =============================================================================
const updateCurrencySuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateCurrencyError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// =============================== Bitcoin Unit ================================
// =============================================================================
const updateBitcoinUnitSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateBitcoinUnitError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// =============================== Logging Level ===============================
// =============================================================================
const updateLoggingLevelSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateLoggingLevelError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ================================== IP Lock ==================================
// =============================================================================
const updateIpLockSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateIpLockError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ================================= IP Lock on ================================
// =============================================================================
const updateIpLockOnSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateIpLockOnError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// =============================== Block Tor IPs ===============================
// =============================================================================
const updateBlockTorIpsSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateBlockTorIpsError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ================================ Auth Type ==================================
// =============================================================================
const updateAuthTypeSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateAuthTypeError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// =========================== Auth Type Never Save ============================
// =============================================================================
const updateAuthTypeNeverSaveSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.alerts.displaySuccess(data))
}

const updateAuthTypeNeverSaveError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ===================== Google Authenticator Secret Url =======================
// =============================================================================
const getGoogleAuthenticatorSecretUrlSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.modals.showModal('TwoStepGoogleAuthenticator', { googleAuthenticatorSecretUrl: data }))
}

const getGoogleAuthenticatorSecretUrlError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================================================================
// ======================== Google Authenticator Setup =========================
// =============================================================================
const confirmGoogleAuthenticatorSetupSuccess = function * (action) {
  const { data } = action.payload
  yield put(actions.modals.closeAllModals())
  yield put(actions.alerts.displaySuccess(data))
}

const confirmGoogleAuthenticatorSetupError = function * (action) {
  yield put(actions.alerts.displayError(action.payload))
}

// =============================== EXPORT ======================================

function * sagas () {
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_SUCCESS, signAndPublishSuccess)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_ERROR, signAndPublishError)
  yield takeEvery(actionTypes.core.settings.UPDATE_MOBILE_SUCCESS, updateMobileSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_MOBILE_ERROR, updateMobileError)
  yield takeEvery(actionTypes.core.settings.VERIFY_MOBILE_SUCCESS, verifyMobileSuccess)
  yield takeEvery(actionTypes.core.settings.VERIFY_MOBILE_ERROR, verifyMobileError)
  yield takeEvery(actionTypes.core.settings.UPDATE_LANGUAGE_SUCCESS, updateLanguageSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_LANGUAGE_ERROR, updateLanguageError)
  yield takeEvery(actionTypes.core.settings.UPDATE_CURRENCY_SUCCESS, updateCurrencySuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_CURRENCY_ERROR, updateCurrencyError)
  yield takeEvery(actionTypes.core.settings.UPDATE_BITCOIN_UNIT_SUCCESS, updateBitcoinUnitSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_BITCOIN_UNIT_ERROR, updateBitcoinUnitError)
  yield takeEvery(actionTypes.core.settings.UPDATE_LOGGING_LEVEL_SUCCESS, updateLoggingLevelSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_LOGGING_LEVEL_ERROR, updateLoggingLevelError)
  yield takeEvery(actionTypes.core.settings.UPDATE_IP_LOCK_SUCCESS, updateIpLockSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_IP_LOCK_ERROR, updateIpLockError)
  yield takeEvery(actionTypes.core.settings.UPDATE_IP_LOCK_ON_SUCCESS, updateIpLockOnSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_IP_LOCK_ON_ERROR, updateIpLockOnError)
  yield takeEvery(actionTypes.core.settings.UPDATE_BLOCK_TOR_IPS_SUCCESS, updateBlockTorIpsSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_BLOCK_TOR_IPS_ERROR, updateBlockTorIpsError)
  yield takeEvery(actionTypes.core.settings.UPDATE_AUTH_TYPE_SUCCESS, updateAuthTypeSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_AUTH_TYPE_ERROR, updateAuthTypeError)
  yield takeEvery(actionTypes.core.settings.UPDATE_AUTH_TYPE_NEVER_SAVE_SUCCESS, updateAuthTypeNeverSaveSuccess)
  yield takeEvery(actionTypes.core.settings.UPDATE_AUTH_TYPE_NEVER_SAVE_ERROR, updateAuthTypeNeverSaveError)
  yield takeEvery(actionTypes.core.settings.GET_GOOGLE_AUTHENTICATOR_SECRET_URL_SUCCESS, getGoogleAuthenticatorSecretUrlSuccess)
  yield takeEvery(actionTypes.core.settings.GET_GOOGLE_AUTHENTICATOR_SECRET_URL_ERROR, getGoogleAuthenticatorSecretUrlError)
  yield takeEvery(actionTypes.core.settings.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP_SUCCESS, confirmGoogleAuthenticatorSetupSuccess)
  yield takeEvery(actionTypes.core.settings.CONFIRM_GOOGLE_AUTHENTICATOR_SETUP_ERROR, confirmGoogleAuthenticatorSetupError)
}

export default sagas
