import { takeEvery, put, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as selectors from '../selectors.js'

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
export default function * () {
  yield takeEvery(AT.CLICK_RECOVERY_PHASE_FINISH, clickRecoveryPhraseFinish)
}
