import { delay } from 'redux-saga'
import { takeEvery, call, put, select, cancel, cancelled, fork } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { prop, assoc } from 'ramda'
import Either from 'data.either'

import * as AT from './actionTypes'
import { actions, selectors } from 'data'
import { walletSaga } from 'blockchain-wallet-v4/src/redux/wallet/sagas.js'
import { api } from 'services/ApiService'
import { pairing } from 'blockchain-wallet-v4/src'
import settings from 'config'

const walletSagas = walletSaga({ api, walletPath: settings.WALLET_IMMUTABLE_PATH })

// =============================================================================
// ============================ MobileLogin modal ==============================
// =============================================================================

const mobileLoginSuccess = function * (action) {
  const { payload } = action
  const { data } = payload

  try {
    const parsedDataE = pairing.parseQRcode(data)
    if (parsedDataE.isRight) {
      const { guid, encrypted } = parsedDataE.value
      const passphrase = yield call(api.getPairingPassword, guid)
      const credentialsE = pairing.decode(encrypted, passphrase)
      if (credentialsE.isRight) {
        const { sharedKey, password } = credentialsE.value
        yield call(fetchWalletSaga, guid, sharedKey, undefined, password)
      } else {
        throw new Error(credentialsE.value)
      }
    } else {
      throw new Error(parsedDataE.value)
    }
  } catch (error) {
    yield put(actions.alerts.displayError(error.message))
  }
  yield put(actions.modals.closeModal())
}

const mobileLoginError = function * (action) {
  yield put(actions.alerts.displayError('Error using mobile login'))
  yield put(actions.modals.closeModal())
}



// function * sagas () {
//   yield takeEvery(AT.LOGIN, login)
//   // yield takeEvery(AT.LOGIN_SUCCESS, loginSuccess)
//   // yield takeEvery(AT.LOGIN_ERROR, loginError)

//   yield takeEvery(AT.MOBILE_LOGIN_SUCCESS, mobileLoginSuccess)
//   yield takeEvery(AT.MOBILE_LOGIN_ERROR, mobileLoginError)



//   yield takeEvery(actionTypes.core.wallet.CREATE_WALLET_SUCCESS, registerSuccess)
//   yield takeEvery(actionTypes.core.wallet.CREATE_WALLET_ERROR, registerError)

//   yield takeEvery(actionTypes.core.wallet.RESTORE_WALLET_SUCCESS, restoreWalletSuccess)
//   yield takeEvery(actionTypes.core.wallet.RESTORE_WALLET_ERROR, restoreWalletError)
// }

// export default sagas

// =============================================================================
// ================================= Generic ===================================
// =============================================================================

const loginRoutineSaga = function * () {
  const context = yield select(selectors.core.wallet.getWalletContext)
  const sharedKey = yield select(selectors.core.wallet.getSharedKey)
  const guid = yield select(selectors.core.wallet.getGuid)
  yield put(actions.core.common.fetchBlockchainData(context))
  yield put(actions.core.settings.fetchSettings({ guid, sharedKey }))
  yield put(actions.core.webSocket.startSocket())
  yield put(actions.auth.loginSuccess())
  yield put(actions.alerts.displaySuccess('Login successful'))
  yield put(actions.auth.logoutStartTimer)
  yield put(push('/wallet'))
}

// =============================================================================
// ================================== Login ====================================
// =============================================================================

const pollingSaga = function * (session, n = 50) {
  if (n === 0) { return false }
  try {
    yield call(delay, 2000)
    const response = yield call(api.pollForSessioGUID, session)
    if (prop('guid', response)) { return true }
  } catch (error) {
    return false
  }
  return yield call(pollingSaga, session, n - 1)
}

const login = function * (action) {
  const { guid, password, code } = action.payload
  const safeParse = Either.try(JSON.parse)
  let session = yield select(selectors.auth.getSession(guid))

  try {
    if (!session) { session = yield call(api.establishSession) }
    yield put(actions.auth.saveSession(assoc(guid, session, {})))
    yield call(walletSagas.fetchWalletSaga, guid, undefined, session, password, code)
    yield call(loginRoutineSaga)
  } catch (error) {
    const initialError = safeParse(error).map(prop('initial_error'))
    const authRequired = safeParse(error).map(prop('authorization_required'))

    if (authRequired.isRight && authRequired.value) {
      // auth errors (polling)
      yield put(actions.alerts.displayInfo('Authorization required. Please check your mailbox.'))
      const authorized = yield call(pollingSaga, session)
      if (authorized) {
        yield call(walletSagas.fetchWalletSaga, guid, undefined, session, password)
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

// =============================================================================
// ================================ Register ===================================
// =============================================================================
const register = function * (action) {
  try {
    yield put(actions.alerts.displayInfo('Creating wallet...'))
    yield call(walletSagas.createWalletSaga, action)
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
  try {
    yield put(actions.alerts.displayInfo('Restoring wallet...'))
    yield call(walletSagas.restoreWalletSaga, action)
    yield put(actions.alerts.displaySuccess('Your wallet has been successfully restored.'))
    yield call(loginRoutineSaga)
  } catch (e) {
    yield put(actions.alerts.displayError('Error restoring your wallet.'))
  }
}

// =============================================================================
// ================================== Logout ===================================
// =============================================================================
let timerTask

const logoutStart = function * () {
  // yield put(actions.core.webSocket.stopSocket())
  console.log('logout start')
  window.location.reload(true)
}

const logoutStartTimer = function * () {
  console.log('logout start timer')
  timerTask = yield fork(logoutTimer)
  console.log('after timer')
  return true
}

const logoutResetTimer = function * () {
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
      yield put(actions.auth.logoutStartTimer())
    } else {
      // If the timer reaches the end, we logout
      yield put(actions.auth.logoutStart())
    }
  }
}

function * sagas () {
  yield takeEvery(AT.LOGIN, login)
  yield takeEvery(AT.REGISTER, register)
  yield takeEvery(AT.RESTORE, restore)
  yield takeEvery(AT.LOGOUT_START_TIMER, logoutStartTimer)
  yield takeEvery(AT.LOGOUT_RESET_TIMER, logoutResetTimer)
  yield takeEvery(AT.LOGOUT_START, logoutStart)
}

export default sagas
