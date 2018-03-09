import { delay } from 'redux-saga'
import { takeLatest, call, put, select, take, cancel, cancelled, fork, all, race } from 'redux-saga/effects'
import { prop, assoc } from 'ramda'
import Either from 'data.either'

import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'
import * as sagas from '../sagas.js'
import { api } from 'services/ApiService'
import { askSecondPasswordEnhancer, promptForSecondPassword, forceSyncWallet } from 'services/SagaService'

// =============================================================================
// ================================== Addons ===================================
// =============================================================================

const upgradeWallet = function * () {
  try {
    let password = yield call(promptForSecondPassword)
    yield sagas.core.wallet.upgradeToHd({ password })
    yield call(forceSyncWallet)
    yield put(actions.modals.closeModal())
  } catch (e) {
    yield put(actions.alerts.displayError('Failed to upgrade to HD and save wallet'))
  }
}

const upgradeWalletSaga = function * () {
  yield put(actions.modals.showModal('UpgradeWallet'))
  yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
}

const transferEtherSaga = function * () {
  const legacyAccountBalance = yield select(selectors.core.data.ethereum.getLegacyAccountBalance)
  if (parseFloat(legacyAccountBalance) > 0) {
    // yield put(actions.payment.ethereum.initTransferEther())
  }
}

const loginRoutineSaga = function * () {
  try {
    // If needed, the user should upgrade its wallet before being able to open the wallet
    let isHdWallet = yield select(selectors.core.wallet.isHdWallet)
    if (!isHdWallet) {
      yield upgradeWalletSaga()
    }
    yield put(actions.auth.authenticate())
    // yield put(actions.core.webSocket.startSocket())
    yield call(sagas.core.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
    yield put(actions.alerts.displaySuccess('Login successful'))
    yield put(actions.router.push('/wallet'))
    yield put(actions.goals.runGoals())
    // ETHER - Fix derivation
    // yield call(transferEtherSaga)
  } catch (e) {
    // Redirect to error page instead of notification
    yield put(actions.alerts.displayError('Critical error while fetching essential data !' + e.message))
  }
}

// =============================================================================
// ================================== Login ====================================
// =============================================================================

const pollingSession = function * (session, n = 50) {
  if (n === 0) { return false }
  try {
    yield call(delay, 2000)
    const response = yield call(api.pollForSessionGUID, session)
    if (prop('guid', response)) { return true }
  } catch (error) {
    return false
  }
  return yield call(pollingSession, session, n - 1)
}

export const login = function * (action) {
  const { guid, sharedKey, password, code } = action.payload
  const safeParse = Either.try(JSON.parse)
  let session = yield select(selectors.session.getSession(guid))

  try {
    if (!session) { session = yield call(api.obtainSessionToken) }
    yield put(actions.session.saveSession(assoc(guid, session, {})))
    yield call(sagas.core.wallet.fetchWalletSaga, { guid, sharedKey, session, password, code })
    yield call(loginRoutineSaga)
  } catch (error) {
    const initialError = safeParse(error).map(prop('initial_error'))
    const authRequired = safeParse(error).map(prop('authorization_required'))

    if (authRequired.isRight && authRequired.value) {
      // auth errors (polling)
      yield put(actions.alerts.displayInfo('Authorization required. Please check your mailbox.'))
      const authorized = yield call(pollingSession, session)
      if (authorized) {
        yield call(sagas.core.wallet.fetchWalletSaga, { guid, session, password })
        yield call(loginRoutineSaga)
      } else {
        yield put(actions.alerts.displayError('Error establishing the session'))
      }
    } else if (initialError.isRight && initialError.value) {
      // general error
      yield put(actions.alerts.displayError(initialError.value))
    } else {
      // 2FA errors
      if (error.auth_type > 0) { // 2fa required
        // dispatch state change to show form
        yield put(actions.auth.setAuthType(error.auth_type))
        yield put(actions.alerts.displayInfo('2FA required'))
      } else if (error.message) {
        yield put(actions.alerts.displayError(error.message))
      } else {
        yield put(actions.alerts.displayError(error || 'Error logging into your wallet'))
      }
    }
  }
}

export const mobileLogin = function * (action) {
  try {
    const { guid, sharedKey, password } = yield call(sagas.core.settings.decodePairingCode, action.payload)
    const loginAction = actions.auth.login(guid, password, undefined, sharedKey)
    yield call(login, loginAction)
  } catch (error) {
    yield put(actions.alerts.displayError('Error logging into your wallet'))
  }
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ================================ Register ===================================
// =============================================================================
export const register = function * (action) {
  try {
    yield put(actions.alerts.displayInfo('Creating wallet...'))
    yield call(sagas.core.wallet.createWalletSaga, action.payload)
    yield put(actions.alerts.displaySuccess('Wallet successfully created.'))
    yield call(loginRoutineSaga)
  } catch (e) {
    yield put(actions.alerts.displayError('Wallet could not be created.'))
  }
}

// =============================================================================
// ================================= Restore ===================================
// =============================================================================
export const restore = function * (action) {
  try {
    yield put(actions.alerts.displayInfo('Restoring wallet...'))
    yield call(sagas.core.wallet.restoreWalletSaga, action.payload)
    yield put(actions.alerts.displaySuccess('Your wallet has been successfully restored.'))
    yield call(loginRoutineSaga)
  } catch (e) {
    yield put(actions.alerts.displayError('Error restoring your wallet.'))
  }
}

// =============================================================================
// =============================== Remind Guid =================================
// =============================================================================
export const remindGuid = function * (action) {
  try {
    yield call(sagas.core.wallet.remindWalletGuidSaga, action.payload)
    yield put(actions.alerts.displaySuccess('Your wallet guid has been sent to your email address.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Error sending email.'))
  }
}

// =============================================================================
// ================================ Reset 2fa ==================================
// =============================================================================
const reset2fa = function * (action) {
  try {
    const response = yield call(sagas.core.wallet.resetWallet2fa, action.payload)
    if (response.success) {
      yield put(actions.alerts.displayInfo('Reset 2-step Authentication has been successfully submitted. You will reset an email shortly when the authentication is successfully reset.'))
    } else {
      yield put(actions.alerts.displayError(response.message))
    }
  } catch (e) {
    yield put(actions.alerts.displayError('Error resetting 2-step authentication.'))
  }
}

// =============================================================================
// ================================== Logout ===================================
// =============================================================================
let timerTask

const logoutTimer = function * () {
  try {
    const autoLogout = yield select(selectors.core.wallet.getLogoutTime)
    let elapsed = 0
    const total = parseInt(autoLogout / 1000)
    const threshold = 10

    while (elapsed < total) {
      // When we reach the threshold value, we show the auto-disconnection modal
      if (total - elapsed === threshold) {
        yield put(actions.modals.showModal('AutoDisconnection', { duration: threshold }))
      }
      yield call(delay, 1000)
      elapsed++
    }
  } finally {
    if (yield cancelled()) {
      // If the task has been cancelled (reset timer), we restart the timer
      yield put(actions.modals.closeModal())
      yield put(actions.auth.startLogoutTimer())
    } else {
      // If the timer reaches the end, we logout
      yield put(actions.auth.logout())
    }
  }
}

export const logout = function * () {
  // yield put(actions.core.webSocket.stopSocket()
  window.location.reload(true)
}

export const startLogoutTimer = function * () {
  timerTask = yield fork(logoutTimer)
}

export const resetLogoutTimer = function * () {
  yield cancel(timerTask)
}

export default function * () {
  yield takeLatest(AT.LOGIN, login)
  yield takeLatest(AT.MOBILE_LOGIN, mobileLogin)
  yield takeLatest(AT.REGISTER, register)
  yield takeLatest(AT.RESTORE, restore)
  yield takeLatest(AT.REMIND_GUID, remindGuid)
  // yield takeLatest(AT.AUTHENTICATE, startLogoutTimer)
  yield takeLatest(AT.LOGOUT, logout)
  yield takeLatest(AT.LOGOUT_RESET_TIMER, resetLogoutTimer)
  yield takeLatest(AT.RESET_2FA, reset2fa)
  yield takeLatest(AT.UPGRADE_WALLET, upgradeWallet)
}
