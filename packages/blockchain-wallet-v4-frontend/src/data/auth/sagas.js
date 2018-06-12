import { call, put, select, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { path, prop, assoc } from 'ramda'
import Either from 'data.either'

import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'
import * as C from 'services/AlertService'
import { askSecondPasswordEnhancer, promptForSecondPassword, forceSyncWallet } from 'services/SagaService'
import { Types } from 'blockchain-wallet-v4/src'

export default ({ api, coreSagas }) => {
  const logLocation = 'auth/sagas'
  const upgradeWallet = function * () {
    try {
      let password = yield call(promptForSecondPassword)
      yield coreSagas.wallet.upgradeToHd({ password })
      yield call(forceSyncWallet)
      yield put(actions.modals.closeModal())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'upgradeWallet', e))
      yield put(actions.alerts.displayError(C.WALLET_UPGRADE_ERROR))
    }
  }

  const welcomeSaga = function * (firstLogin) {
    if (firstLogin) {
      const walletNUsers = yield call(api.getWalletNUsers)
      const walletMillions = Math.floor(walletNUsers.values[walletNUsers.values.length - 1].y / 1e6)
      yield put(actions.modals.showModal('Welcome', { walletMillions }))
    } else {
      yield put(actions.logs.logInfoMessage(logLocation, 'welcomeSaga', 'login success'))
      yield put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
    }
  }

  const upgradeWalletSaga = function * () {
    yield put(actions.modals.showModal('UpgradeWallet'))
    yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
  }

  const transferEthSaga = function * () {
    const legacyAccountR = yield select(selectors.core.kvStore.ethereum.getLegacyAccount)
    const legacyAccount = legacyAccountR.getOrElse(null)
    const { addr, correct } = legacyAccount || {}
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
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy('login'))
      yield put(actions.auth.loginSuccess())
      yield put(actions.auth.startLogoutTimer())
      yield put(actions.goals.runGoals())
      yield fork(transferEthSaga)
      yield fork(welcomeSaga, firstLogin)
      yield fork(reportStats, mobileLogin)
      yield fork(logoutRoutine, yield call(setLogoutEventListener))
      if (!firstLogin) {
        yield put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
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
    let session = yield select(selectors.session.getSession, guid)

    try {
      if (!session) { session = yield call(api.obtainSessionToken) }
      yield put(actions.session.saveSession(assoc(guid, session, {})))
      yield put(actions.cache.guidEntered(guid))
      yield put(actions.auth.loginLoading())
      yield call(coreSagas.wallet.fetchWalletSaga, { guid, sharedKey, session, password, code })
      yield call(loginRoutineSaga, mobileLogin)
    } catch (error) {
      const initialError = safeParse(error).map(prop('initial_error'))
      const authRequired = safeParse(error).map(prop('authorization_required'))

      if (authRequired.isRight && authRequired.value) {
        // auth errors (polling)
        yield put(actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO))
        const authorized = yield call(pollingSession, session)
        if (authorized) {
          try {
            yield call(coreSagas.wallet.fetchWalletSaga, { guid, session, password })
            yield call(loginRoutineSaga, mobileLogin)
          } catch (e) {
            if (e.auth_type > 0) {
              yield put(actions.auth.setAuthType(e.auth_type))
              yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
              yield put(actions.auth.loginFailure())
            } else {
              yield put(actions.auth.loginFailure('wrong_wallet_password'))
              yield put(actions.logs.logErrorMessage(logLocation, 'login', e))
            }
          }
        } else {
          yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
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
          yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'mobileLogin', error))
      if (error === 'qr_code_expired') {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED))
      } else {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR))
      }
    }
    yield put(actions.modals.closeModal())
  }

  const register = function * (action) {
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.alerts.displayInfo(C.CREATE_WALLET_INFO))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      yield call(loginRoutineSaga, false, true)
      yield put(actions.auth.registerSuccess())
    } catch (e) {
      yield put(actions.auth.registerFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
      yield put(actions.alerts.displayError(C.REGISTER_ERROR))
    }
  }

  const restore = function * (action) {
    try {
      yield put(actions.auth.restoreLoading())
      yield put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
      yield call(coreSagas.wallet.restoreWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
      yield call(loginRoutineSaga, false, true)
      yield put(actions.auth.restoreSuccess())
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const remindGuid = function * (action) {
    try {
      yield call(coreSagas.wallet.remindWalletGuidSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.GUID_SENT_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'remindGuid', e))
      if (e.message === 'Captcha Code Incorrect') {
        yield put(actions.core.data.misc.fetchCaptcha())
        yield put(actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT))
      } else {
        yield put(actions.alerts.displayError(C.GUID_SENT_ERROR))
      }
    }
  }

  const reset2fa = function * (action) {
    try {
      yield put(actions.auth.reset2faLoading())
      const response = yield call(coreSagas.wallet.resetWallet2fa, action.payload)
      if (response.success) {
        yield put(actions.auth.reset2faSuccess())
        yield put(actions.alerts.displayInfo(C.RESET_TWOFA_INFO))
      } else {
        throw new Error(response.message)
      }
    } catch (e) {
      yield put(actions.core.data.misc.fetchCaptcha())
      yield put(actions.auth.reset2faFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'reset2fa', e))
      switch (e.toString()) {
        case 'Wallet Identifier Not Found': {
          return yield put(actions.alerts.displayError(C.TWOFA_RESET_UNKNOWN_GUID_ERROR))
        }
        case 'Error: Two factor authentication not enabled.': {
          return yield put(actions.alerts.displayError(C.TWOFA_RESET_NOT_ENABLED_ERROR))
        }
        case 'Error: Email entered does not match the email address associated with this wallet': {
          return yield put(actions.alerts.displayError(C.TWOFA_RESET_EMAIL_ERROR))
        }
        case 'Error: Captcha Code Incorrect': {
          return yield put(actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT))
        }
        default:
          return yield put(actions.alerts.displayError(C.TWOFA_RESET_ERROR))
      }
    }
  }

  const setLogoutEventListener = function () {
    return new Promise(resolve => {
      window.addEventListener('wallet.core.logout', resolve)
    })
  }

  const resendSmsLoginCode = function * (action) {
    try {
      const { guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid)
      const response = yield call(coreSagas.wallet.resendSmsLoginCode, { guid, sessionToken })
      if (response.initial_error) {
        throw new Error(response)
      } else {
        yield put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resendSmsLoginCode', e))
      yield put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
    }
  }

  const logoutRoutine = function * () {
    yield call(logout)
  }

  const logout = function * () {
    yield put(actions.core.webSocket.bitcoin.stopSocket())
    yield put(actions.core.webSocket.ethereum.stopSocket())
    yield put(actions.core.webSocket.bch.stopSocket())
    yield put(actions.router.push('/logout'))
  }

  const deauthorizeBrowser = function * () {
    try {
      const guid = yield select(selectors.core.wallet.getGuid)
      const sessionToken = yield select(selectors.session.getSession, guid)
      yield call(api.deauthorizeBrowser, sessionToken)
      yield put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', e))
      yield put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
    } finally {
      yield put(actions.router.push('/login'))
    }
  }

  return {
    deauthorizeBrowser,
    login,
    logout,
    loginRoutineSaga,
    mobileLogin,
    register,
    remindGuid,
    reset2fa,
    resendSmsLoginCode,
    restore,
    upgradeWallet
  }
}
