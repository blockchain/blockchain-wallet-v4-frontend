import { takeEvery, put, select } from 'redux-saga/effects'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import { actions, actionTypes, selectors } from 'data'
import * as AT from './actionTypes'

// =============================================================================
// =========================== RecoveryPhase Modal ============================
// =============================================================================
const clickRecoveryPhraseFinish = function * (action) {
  yield put(actions.core.wallet.verifyMnemonic())
  yield put(actions.modals.closeModal())
  yield put(actions.alerts.displaySuccess('Your mnemonic has been verified !'))
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
  // RecoveryPhrase
  yield takeEvery(AT.CLICK_RECOVERY_PHASE_FINISH, clickRecoveryPhraseFinish)
 // TwoStepYubikey
  //yield takeEvery(actionTypes.core.settings.ENABLE_YUBIKEY_SUCCESS, clickTwoStepYubicoEnableConfirmation)
}

export default sagas
