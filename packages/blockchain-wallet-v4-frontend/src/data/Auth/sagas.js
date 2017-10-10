import { delay } from 'redux-saga'
import { takeEvery, call, put, select, cancel, cancelled, fork } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { prop, assoc } from 'ramda'
import Either from 'data.either'

import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { walletSaga } from 'blockchain-wallet-v4/src/redux/wallet/sagas.js'
import { settingsSaga } from 'blockchain-wallet-v4/src/redux/settings/sagas.js'
import { api } from 'services/ApiService'
import settings from 'config'

const walletSagas = walletSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })
const settingsSagas = settingsSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })
// =============================================================================
// ================================= Generic ===================================
// =============================================================================

const loginRoutineSaga = function * () {
  yield put(actions.auth.authenticate())
  yield put(actions.core.webSocket.startSocket())
  yield put(actions.data.initData())
  yield put(actions.settings.initSettings())
  yield put(actions.alerts.displaySuccess('Login successful'))
  yield put(push('/wallet'))
}

// =============================================================================
// ================================== Login ====================================
// =============================================================================

const pollingSession = function * (session, n = 50) {
  if (n === 0) { return false }
  try {
    yield call(delay, 2000)
    const response = yield call(api.pollForSessioGUID, session)
    if (prop('guid', response)) { return true }
  } catch (error) {
    return false
  }
  return yield call(pollingSession, session, n - 1)
}

const login = function * (action) {
  const { guid, sharedKey, password, code } = action.payload
  const safeParse = Either.try(JSON.parse)
  let session = yield select(selectors.session.getSession(guid))

  try {
    if (!session) { session = yield call(api.establishSession) }
    yield put(actions.session.saveSession(assoc(guid, session, {})))
    yield call(walletSagas.fetchWalletSaga, { guid, sharedKey, session, password, code })
    yield call(loginRoutineSaga)
  } catch (error) {
    const initialError = safeParse(error).map(prop('initial_error'))
    const authRequired = safeParse(error).map(prop('authorization_required'))

    if (authRequired.isRight && authRequired.value) {
      // auth errors (polling)
      yield put(actions.alerts.displayInfo('Authorization required. Please check your mailbox.'))
      const authorized = yield call(pollingSession, session)
      if (authorized) {
        yield call(walletSagas.fetchWalletSaga, { guid, session, password })
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

const mobileLogin = function * (action) {
  try {
    const { guid, sharedKey, password } = yield call(settingsSagas.decodePairingCode, action)
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
const register = function * (action) {
  const { password, email } = action.payload
  try {
    yield put(actions.alerts.displayInfo('Creating wallet...'))
    yield call(walletSagas.createWalletSaga, { password, email })
    yield put(actions.alerts.displaySuccess('Wallet successfully created.'))
    yield call(loginRoutineSaga)
  } catch (e) {
    yield put(actions.alerts.displayError('Wallet could not be created.'))
  }
}

// =============================================================================
// ================================= Restore ===================================
// =============================================================================
const restore = function * (action) {
  const { mnemonic, email, password, network } = action.payload
  try {
    yield put(actions.alerts.displayInfo('Restoring wallet...'))
    yield call(walletSagas.restoreWalletSaga, { mnemonic, email, password, network })
    yield put(actions.alerts.displaySuccess('Your wallet has been successfully restored.'))
    yield call(loginRoutineSaga)
  } catch (e) {
    yield put(actions.alerts.displayError('Error restoring your wallet.'))
  }
}

// =============================================================================
// =============================== Remind Guid =================================
// =============================================================================
const remindGuid = function * (action) {
  const { email, code, sessionToken } = action.payload
  try {
    yield call(walletSagas.remindWalletGuidSaga, { email, code, sessionToken })
    yield put(actions.alerts.displaySuccess('Your wallet guid has been sent to your email address.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Error sending email.'))
  }
}

// =============================================================================
// ================================== Logout ===================================
// =============================================================================
let timerTask

const logout = function * () {
  // yield put(actions.core.webSocket.stopSocket()
  window.location.reload(true)
}

const startLogoutTimer = function * () {
  timerTask = yield fork(logoutTimer)
}

const resetLogoutTimer = function * () {
  yield cancel(timerTask)
}

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

function * sagas () {
  yield takeEvery(AT.LOGIN, login)
  yield takeEvery(AT.MOBILE_LOGIN, mobileLogin)
  yield takeEvery(AT.REGISTER, register)
  yield takeEvery(AT.RESTORE, restore)
  yield takeEvery(AT.REMIND_GUID, remindGuid)
  yield takeEvery(AT.AUTHENTICATE, startLogoutTimer)
  yield takeEvery(AT.LOGOUT, logout)
  yield takeEvery(AT.LOGOUT_RESET_TIMER, resetLogoutTimer)
}

export default sagas
