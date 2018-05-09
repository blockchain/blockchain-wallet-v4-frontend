import { call, put, select, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { path, prop, assoc } from 'ramda'
import Either from 'data.either'

import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'
import { askSecondPasswordEnhancer, promptForSecondPassword, forceSyncWallet } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'

// =============================================================================
// ================================== Addons ===================================
// =============================================================================
export default ({ api, coreSagas }) => {
  const upgradeWallet = function * () {
    try {
      let password = yield call(promptForSecondPassword)
      yield coreSagas.wallet.upgradeToHd({ password })
      yield call(forceSyncWallet)
      yield put(actions.modals.closeModal())
    } catch (e) {
      yield put(actions.alerts.displayError('Failed to upgrade to HD and save wallet'))
    }
  }

  const welcomeSaga = function * (firstLogin) {
    if (firstLogin) {
      const walletNUsers = yield call(api.getWalletNUsers)
      const walletMillions = Math.floor(walletNUsers.values[walletNUsers.values.length - 1].y / 1e6)
      yield put(actions.modals.showModal('Welcome', { walletMillions }))
    } else {
      yield put(actions.alerts.displaySuccess('Login successful'))
    }
  }

  const upgradeWalletSaga = function * () {
    yield put(actions.modals.showModal('UpgradeWallet'))
    yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
  }

  const transferEthSaga = function * () {
    const legacyAccountR = yield select(selectors.core.kvStore.ethereum.getLegacyAccount)
    const legacyAccount = legacyAccountR.getOrElse({})
    const { addr, correct } = legacyAccount
    // If needed, get the ethereum legacy account balance and prompt sweep
    if (!correct && addr) {
      const balances = yield call(api.getEthereumBalances, addr)
      const balance = path([addr, 'balance'], balances)
      if (balance > 0) {
        yield put(actions.modals.showModal('TransferEth', { balance, addr }))
      }
    }
  }

  const loginRoutineSaga = function * (mobileLogin, firstLogin) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      let isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield upgradeWalletSaga()
      }
      yield put(actions.auth.authenticate())
      yield put(actions.core.webSocket.bitcoin.startSocket())
      yield put(actions.core.webSocket.ethereum.startSocket())
      yield put(actions.core.webSocket.bch.startSocket())
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.ethereum.fetchMetadataEthereum)
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield put(actions.router.push('/home'))
      yield put(actions.auth.startLogoutTimer())
      yield put(actions.goals.runGoals())
      yield fork(transferEthSaga)
      yield fork(welcomeSaga, firstLogin)
      yield fork(reportStats, mobileLogin)
      yield fork(logoutRoutine, yield call(setLogoutEventListener))
      if (!firstLogin) {
        yield put(actions.alerts.displaySuccess('Login successful'))
      }
    } catch (e) {
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError('Critical error while fetching essential data! ' + e.message))
    }
  }

  const reportStats = function * (mobileLogin) {
    if (mobileLogin) {
      yield call(api.incrementLoginViaQrStats)
    } else {
      const wallet = yield select(selectors.core.wallet.getWallet)
      yield call(api.incrementSecPasswordStats, Types.Wallet.isDoubleEncrypted(wallet))
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

  const login = function * (action) {
    let { guid, sharedKey, password, code, mobileLogin } = action.payload
    const safeParse = Either.try(JSON.parse)
    let session = yield select(selectors.session.getSession(guid))

    try {
      if (!session) { session = yield call(api.obtainSessionToken) }
      yield put(actions.session.saveSession(assoc(guid, session, {})))
      yield put(actions.cache.guidEntered(guid))
      yield put(actions.auth.loginLoading())
      yield call(coreSagas.wallet.fetchWalletSaga, { guid, sharedKey, session, password, code })
      yield call(loginRoutineSaga, mobileLogin)
      yield put(actions.auth.loginSuccess())
    } catch (error) {
      const initialError = safeParse(error).map(prop('initial_error'))
      const authRequired = safeParse(error).map(prop('authorization_required'))

      if (authRequired.isRight && authRequired.value) {
        // auth errors (polling)
        yield put(actions.alerts.displayInfo('Authorization required. Please check your mailbox.'))
        const authorized = yield call(pollingSession, session)
        if (authorized) {
          try {
            yield call(coreSagas.wallet.fetchWalletSaga, { guid, session, password })
            yield call(loginRoutineSaga, mobileLogin)
          } catch (e) {
            if (e.auth_type > 0) {
              yield put(actions.auth.setAuthType(e.auth_type))
              yield put(actions.alerts.displayInfo('2FA required'))
              yield put(actions.auth.loginFailure())
            } else {
              // TODO: write to logger here
              yield put(actions.alerts.displayError(e.message || 'Error logging into your wallet'))
            }
          }
        } else {
          yield put(actions.alerts.displayError('Error establishing the session'))
        }
      } else if (initialError.isRight && initialError.value) {
        // general error
        yield put(actions.auth.loginFailure(initialError.value))
      } else {
        // 2FA errors
        if (error.auth_type > 0) { // 2fa required
          // dispatch state change to show form
          yield put(actions.auth.loginFailure())
          yield put(actions.auth.setAuthType(error.auth_type))
          yield put(actions.alerts.displayInfo('2FA required'))
        } else if (error.message) {
          yield put(actions.auth.loginFailure(error.message))
        } else {
          yield put(actions.auth.loginFailure(error || 'Error logging into your wallet'))
        }
      }
    }
  }

  const mobileLogin = function * (action) {
    try {
      const { guid, sharedKey, password } = yield call(coreSagas.settings.decodePairingCode, action.payload)
      const loginAction = actions.auth.login(guid, password, undefined, sharedKey, true)
      yield call(login, loginAction)
    } catch (error) {
      if (error === 'qr_code_expired') {
        yield put(actions.alerts.displayError('Error: QR code expired'))
      } else {
        yield put(actions.alerts.displayError('Error logging into your wallet'))
      }
    }
    yield put(actions.modals.closeModal())
  }

  // =============================================================================
  // ================================ Register ===================================
  // =============================================================================
  const register = function * (action) {
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.alerts.displayInfo('Creating wallet...'))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess('Wallet successfully created.'))
      yield call(loginRoutineSaga, false, true)
      yield put(actions.auth.registerSuccess())
    } catch (e) {
      yield put(actions.auth.registerFailure())
      yield put(actions.alerts.displayError('Wallet could not be created.'))
    }
  }

  // =============================================================================
  // ================================= Restore ===================================
  // =============================================================================
  const restore = function * (action) {
    try {
      yield put(actions.auth.restoreLoading())
      yield put(actions.alerts.displayInfo('Restoring wallet...'))
      yield call(coreSagas.wallet.restoreWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess('Your wallet has been successfully restored.'))
      yield call(loginRoutineSaga)
      yield put(actions.auth.restoreSuccess())
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.alerts.displayError('Error restoring your wallet.'))
    }
  }

  // =============================================================================
  // =============================== Remind Guid =================================
  // =============================================================================
  const remindGuid = function * (action) {
    try {
      yield call(coreSagas.wallet.remindWalletGuidSaga, action.payload)
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
      yield put(actions.auth.reset2faLoading())
      const response = yield call(coreSagas.wallet.resetWallet2fa, action.payload)
      if (response.success) {
        yield put(actions.auth.reset2faSuccess())
        yield put(actions.alerts.displayInfo('Reset 2-step Authentication has been successfully submitted. Please check your email for more information.'))
      } else {
        yield put(actions.auth.reset2faFailure())
        yield put(actions.alerts.displayError(response.message))
      }
    } catch (e) {
      yield put(actions.auth.reset2faFailure())
      yield put(actions.alerts.displayError('Error resetting 2-step authentication.'))
    }
  }

  // =============================================================================
  // ================================== Logout ===================================

  const setLogoutEventListener = function () {
    return new Promise(resolve => {
      window.addEventListener('wallet.core.logout', resolve)
    })
  }

  const logoutRoutine = function * () {
    yield call(logout)
  }

  const logout = function * () {
    yield put(actions.core.webSocket.bitcoin.stopSocket())
    yield put(actions.core.webSocket.ethereum.stopSocket())
    yield put(actions.core.webSocket.bch.stopSocket())
    yield window.location.reload(true)
  }

  return {
    login,
    mobileLogin,
    register,
    restore,
    remindGuid,
    logout,
    reset2fa,
    upgradeWallet
  }
}
