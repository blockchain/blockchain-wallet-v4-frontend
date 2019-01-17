import { call, put, select, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { assoc, path, prop, is } from 'ramda'

import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'
import * as C from 'services/AlertService'
import * as CC from 'services/ConfirmService'
import {
  askSecondPasswordEnhancer,
  confirm,
  promptForSecondPassword,
  forceSyncWallet
} from 'services/SagaService'
import { Remote } from 'blockchain-wallet-v4/src'
import { checkForVulnerableAddressError } from 'services/ErrorCheckService'

export const logLocation = 'auth/sagas'
export const defaultLoginErrorMessage = 'Error logging into your wallet'
// TODO: make this a global error constant
export const wrongWalletPassErrorMessage = 'wrong_wallet_password'
export const guidNotFound2faErrorMessage = 'Wallet Identifier Not Found'
export const notEnabled2faErrorMessage =
  'Error: Two factor authentication not enabled.'
export const emailMismatch2faErrorMessage =
  'Error: Email entered does not match the email address associated with this wallet'
export const wrongCaptcha2faErrorMessage = 'Error: Captcha Code Incorrect'
export const wrongAuthCodeErrorMessage = 'Authentication code is incorrect'

export default ({ api, coreSagas }) => {
  const upgradeWallet = function*() {
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
  const upgradeWalletSaga = function*() {
    yield put(actions.modals.showModal('UpgradeWallet'))
    yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
  }

  const upgradeAddressLabelsSaga = function*() {
    const addressLabelSize = yield call(coreSagas.kvStore.btc.fetchMetadataBtc)
    if (addressLabelSize > 100) {
      yield put(
        actions.modals.showModal('UpgradeAddressLabels', {
          duration: addressLabelSize / 20
        })
      )
    }
    if (addressLabelSize >= 0) {
      yield call(coreSagas.kvStore.btc.createMetadataBtc)
    }
    if (addressLabelSize > 100) {
      yield put(actions.modals.closeModal())
    }
  }

  const transferEthSaga = function*() {
    const legacyAccountR = yield select(
      selectors.core.kvStore.ethereum.getLegacyAccount
    )
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

  const authNabu = function*() {
    yield put(actions.components.identityVerification.fetchSupportedCountries())
    yield take(
      action =>
        action.type ===
          actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES &&
        !Remote.Loading.is(action.payload.countries)
    )
    const userFlowSupported = (yield select(
      selectors.modules.profile.userFlowSupported
    )).getOrElse(false)
    if (userFlowSupported) yield put(actions.modules.profile.signIn())
  }

  const loginRoutineSaga = function*(mobileLogin, firstLogin) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield call(upgradeWalletSaga)
      }
      yield put(actions.auth.authenticate())
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      // If there was no ethereum metadata kv store entry, we need to create one and that requires the second password.
      yield call(
        coreSagas.kvStore.ethereum.fetchMetadataEthereum,
        askSecondPasswordEnhancer
      )
      yield call(
        coreSagas.kvStore.xlm.fetchMetadataXlm,
        askSecondPasswordEnhancer
      )
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield call(coreSagas.kvStore.bsv.fetchMetadataBsv)
      yield call(coreSagas.kvStore.lockbox.fetchMetadataLockbox)
      yield put(actions.middleware.webSocket.bch.startSocket())
      yield put(actions.middleware.webSocket.btc.startSocket())
      yield put(actions.middleware.webSocket.eth.startSocket())
      yield put(actions.middleware.webSocket.xlm.startStreams())
      yield put(actions.router.push('/home'))
      yield call(coreSagas.settings.fetchSettings)
      yield call(coreSagas.data.xlm.fetchLedgerDetails)
      yield call(coreSagas.data.xlm.fetchData)
      yield call(authNabu)
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.loginSuccess())
      yield put(actions.auth.startLogoutTimer())
      // store guid in cache for future logins
      const guid = yield select(selectors.core.wallet.getGuid)
      yield put(actions.cache.guidEntered(guid))
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy('login'))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      yield fork(transferEthSaga)
      // TODO @analytics.logEvent login flow
      // yield fork(reportStats, mobileLogin)
      yield put(actions.goals.saveGoal('welcome', { firstLogin }))
      yield put(actions.goals.saveGoal('swapUpgrade'))
      yield put(actions.goals.saveGoal('kyc'))
      yield put(actions.goals.runGoals())
      yield fork(checkDataErrors)
      yield put(actions.analytics.reportBalanceStats())
      yield fork(logoutRoutine, yield call(setLogoutEventListener))
      if (!firstLogin) {
        yield put(actions.alerts.displaySuccess(C.LOGIN_SUCCESS))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e)
      )
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const checkAndHandleVulnerableAddress = function*(data) {
    const err = prop('error', data)
    const vulnerableAddress = checkForVulnerableAddressError(err)
    if (vulnerableAddress) {
      yield put(actions.modals.closeAllModals())
      const confirmed = yield call(confirm, {
        title: CC.ARCHIVE_VULNERABLE_ADDRESS_TITLE,
        message: CC.ARCHIVE_VULNERABLE_ADDRESS_MSG,
        confirm: CC.ARCHIVE_VULNERABLE_ADDRESS_CONFIRM,
        cancel: CC.ARCHIVE_VULNERABLE_ADDRESS_CANCEL,
        messageValues: { vulnerableAddress }
      })
      if (confirmed)
        yield put(
          actions.core.wallet.setAddressArchived(vulnerableAddress, true)
        )
    }
  }

  const checkDataErrors = function*() {
    const btcDataR = yield select(selectors.core.data.bitcoin.getInfo)

    if (Remote.Loading.is(btcDataR)) {
      const btcData = yield take(
        actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_FAILURE
      )
      const error = prop('payload', btcData)
      yield call(checkAndHandleVulnerableAddress, { error })
    }
    if (Remote.Failure.is(btcDataR)) {
      yield call(checkAndHandleVulnerableAddress, btcDataR)
    }
  }

  const pollingSession = function*(session, n = 50) {
    if (n === 0) {
      return false
    }
    try {
      yield call(delay, 2000)
      const response = yield call(api.pollForSessionGUID, session)
      if (prop('guid', response)) {
        return true
      }
    } catch (error) {
      return false
    }
    return yield call(pollingSession, session, n - 1)
  }

  const login = function*(action) {
    let { guid, sharedKey, password, code, mobileLogin } = action.payload
    let session = yield select(selectors.session.getSession, guid)
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
      }
      yield put(actions.session.saveSession(assoc(guid, session, {})))
      yield put(actions.auth.loginLoading())
      yield call(coreSagas.wallet.fetchWalletSaga, {
        guid,
        sharedKey,
        session,
        password,
        code
      })
      yield call(loginRoutineSaga, mobileLogin)
    } catch (error) {
      const initialError = prop('initial_error', error)
      const authRequired = prop('authorization_required', error)

      if (authRequired) {
        // auth errors (polling)
        const authRequiredAlert = yield put(
          actions.alerts.displayInfo(
            C.AUTHORIZATION_REQUIRED_INFO,
            undefined,
            true
          )
        )
        const authorized = yield call(pollingSession, session)
        yield put(actions.alerts.dismissAlert(authRequiredAlert.payload.id))
        if (authorized) {
          try {
            yield call(coreSagas.wallet.fetchWalletSaga, {
              guid,
              session,
              password
            })
            yield call(loginRoutineSaga, mobileLogin)
          } catch (error) {
            if (error && error.auth_type > 0) {
              yield put(actions.auth.setAuthType(error.auth_type))
              yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
              yield put(actions.auth.loginFailure())
            } else {
              yield put(actions.auth.loginFailure(wrongWalletPassErrorMessage))
              yield put(
                actions.logs.logErrorMessage(logLocation, 'login', error)
              )
            }
          }
        } else {
          yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
        }
      } else if (initialError) {
        // general error
        yield put(actions.auth.loginFailure(initialError))
      } else if (error && error.auth_type > 0) {
        // 2fa required
        // dispatch state change to show form
        yield put(actions.auth.loginFailure())
        yield put(actions.auth.setAuthType(error.auth_type))
        yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
        // Wrong password error
      } else if (
        error &&
        is(String, error) &&
        error.includes(wrongWalletPassErrorMessage)
      ) {
        // remove 2fa if password is wrong
        // password error can only occur after 2fa validation
        yield put(actions.auth.setAuthType(0))
        yield put(
          actions.form.clearFields('login', false, true, 'password', 'code')
        )
        yield put(actions.form.focus('login', 'password'))
        yield put(actions.auth.loginFailure(error))
        // Wrong 2fa code error
      } else if (
        error &&
        is(String, error) &&
        error.includes(wrongAuthCodeErrorMessage)
      ) {
        yield put(actions.form.clearFields('login', false, true, 'code'))
        yield put(actions.form.focus('login', 'code'))
        yield put(actions.auth.loginFailure(error))
      } else {
        const errorMessage =
          prop('message', error) || error || defaultLoginErrorMessage
        yield put(actions.auth.loginFailure(errorMessage))
      }
    }
  }

  const mobileLogin = function*(action) {
    try {
      const { guid, sharedKey, password } = yield call(
        coreSagas.settings.decodePairingCode,
        action.payload
      )
      const loginAction = actions.auth.login(
        guid,
        password,
        undefined,
        sharedKey,
        true
      )
      yield call(login, loginAction)
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'mobileLogin', error))
      if (error === 'qr_code_expired') {
        yield put(
          actions.alerts.displayError(C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED)
        )
      } else {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR))
      }
    }
    yield put(actions.modals.closeModal())
  }

  const register = function*(action) {
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.alerts.displayInfo(C.CREATE_WALLET_INFO))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      yield call(loginRoutineSaga, false, true)
      yield put(actions.auth.registerSuccess())
    } catch (e) {
      yield put(actions.auth.registerFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
      yield put(actions.alerts.displayError(C.REGISTER_ERROR))
    }
  }

  const restore = function*(action) {
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

  const remindGuid = function*(action) {
    try {
      yield put(actions.auth.remindGuidLoading())
      yield call(coreSagas.wallet.remindWalletGuidSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.GUID_SENT_SUCCESS))
      yield put(actions.auth.remindGuidSuccess())
    } catch (e) {
      yield put(actions.auth.remindGuidFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'remindGuid', e))
      if (e.message === 'Captcha Code Incorrect') {
        yield put(actions.core.data.misc.fetchCaptcha())
        yield put(actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT))
      } else {
        yield put(actions.alerts.displayError(C.GUID_SENT_ERROR))
      }
    }
  }

  const reset2fa = function*(action) {
    try {
      yield put(actions.auth.reset2faLoading())
      const response = yield call(
        coreSagas.wallet.resetWallet2fa,
        action.payload
      )
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
        case guidNotFound2faErrorMessage: {
          return yield put(
            actions.alerts.displayError(C.TWOFA_RESET_UNKNOWN_GUID_ERROR)
          )
        }
        case notEnabled2faErrorMessage: {
          yield put(actions.router.push('/login'))
          return yield put(
            actions.alerts.displayError(C.TWOFA_RESET_NOT_ENABLED_ERROR)
          )
        }
        case emailMismatch2faErrorMessage: {
          return yield put(
            actions.alerts.displayError(C.TWOFA_RESET_EMAIL_ERROR)
          )
        }
        case wrongCaptcha2faErrorMessage: {
          return yield put(
            actions.alerts.displayError(C.CAPTCHA_CODE_INCORRECT)
          )
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

  const resendSmsLoginCode = function*(action) {
    try {
      const { guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid)
      const response = yield call(coreSagas.wallet.resendSmsLoginCode, {
        guid,
        sessionToken
      })
      if (
        response.initial_error &&
        !response.initial_error.includes('login attempts left')
      ) {
        throw new Error(response)
      } else {
        yield put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'resendSmsLoginCode', e)
      )
      yield put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
    }
  }

  const logoutRoutine = function*() {
    yield call(logout)
  }

  const logout = function*() {
    const isEmailVerified = yield select(
      selectors.core.settings.getEmailVerified
    )
    const userFlowSupported = (yield select(
      selectors.modules.profile.userFlowSupported
    )).getOrElse(false)
    if (userFlowSupported) {
      yield put(actions.modules.profile.clearSession())
      yield put(actions.middleware.webSocket.rates.stopSocket())
    }
    yield put(actions.middleware.webSocket.bch.stopSocket())
    yield put(actions.middleware.webSocket.btc.stopSocket())
    yield put(actions.middleware.webSocket.eth.stopSocket())
    yield put(actions.middleware.webSocket.xlm.stopStreams())
    // only show browser de-auth page to accounts with verified email
    isEmailVerified.getOrElse(0)
      ? yield put(actions.router.push('/logout'))
      : yield logoutClearReduxStore()
  }

  const deauthorizeBrowser = function*() {
    try {
      const guid = yield select(selectors.core.wallet.getGuid)
      const sessionToken = yield select(selectors.session.getSession, guid)
      yield call(api.deauthorizeBrowser, sessionToken)
      yield put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', e)
      )
      yield put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
    } finally {
      yield logoutClearReduxStore()
    }
  }

  const logoutClearReduxStore = function*() {
    // router will fallback to /login route
    yield window.history.pushState('', '', '#')
    yield window.location.reload(true)
  }

  return {
    authNabu,
    checkAndHandleVulnerableAddress,
    checkDataErrors,
    deauthorizeBrowser,
    login,
    logout,
    logoutClearReduxStore,
    loginRoutineSaga,
    logoutRoutine,
    mobileLogin,
    pollingSession,
    register,
    remindGuid,
    reset2fa,
    resendSmsLoginCode,
    restore,
    setLogoutEventListener,
    transferEthSaga,
    upgradeWallet,
    upgradeWalletSaga,
    upgradeAddressLabelsSaga
  }
}
