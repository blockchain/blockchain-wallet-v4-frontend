import { assoc, find, is, prop, propEq } from 'ramda'
import { startSubmit, stopSubmit } from 'redux-form'
import { call, delay, fork, put, race, select, take } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'
import { DEFAULT_INVITATIONS } from 'blockchain-wallet-v4/src/model'
import { actions, actionTypes, model, selectors } from 'data'
import * as C from 'services/alerts'
import { isGuid } from 'services/forms'
import { checkForVulnerableAddressError } from 'services/misc'
import { askSecondPasswordEnhancer, confirm, promptForSecondPassword } from 'services/sagas'

import * as A from './actions'
import { guessCurrencyBasedOnCountry } from './helpers'
import { LoginObject, LoginSteps } from './types'

const { MOBILE_LOGIN } = model.analytics

export default ({ api, coreSagas }) => {
  const logLocation = 'auth/sagas'

  const forceSyncWallet = function* () {
    yield put(actions.core.walletSync.forceSync())
    const { error } = yield race({
      error: take(actionTypes.core.walletSync.SYNC_ERROR),
      success: take(actionTypes.core.walletSync.SYNC_SUCCESS)
    })
    if (error) {
      throw new Error('Sync failed')
    }
  }

  const upgradeWallet = function* ({ payload }) {
    try {
      const { version } = payload
      const password = yield call(promptForSecondPassword)
      // eslint-disable-next-line default-case
      switch (version) {
        case 3:
          yield coreSagas.wallet.upgradeToV3({ password })
          break
        case 4:
          yield coreSagas.wallet.upgradeToV4({ password })
          break
      }
      yield call(forceSyncWallet)
    } catch (e) {
      if (e.message === 'Already a v4 wallet') return
      yield put(actions.logs.logErrorMessage(logLocation, 'upgradeWallet', e))
      yield put(actions.alerts.displayError(C.WALLET_UPGRADE_ERROR))
      yield put(actions.modals.closeModal())
    }
  }

  const upgradeAddressLabelsSaga = function* () {
    const addressLabelSize = yield call(coreSagas.kvStore.btc.fetchMetadataBtc)
    if (addressLabelSize > 100) {
      yield put(
        actions.modals.showModal('UPGRADE_ADDRESS_LABELS', {
          duration: addressLabelSize / 20,
          origin: 'LoginSaga'
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

  const saveGoals = function* (firstLogin) {
    // only for non first login users we save goal here for first login users we do that over verify email page
    if (!firstLogin) {
      yield put(actions.goals.saveGoal('welcomeModal', {}))
    }
    yield put(actions.goals.saveGoal('swapUpgrade', {}))
    yield put(actions.goals.saveGoal('swapGetStarted', {}))
    yield put(actions.goals.saveGoal('kycDocResubmit', {}))
    yield put(actions.goals.saveGoal('transferEth', {}))
    yield put(actions.goals.saveGoal('syncPit', {}))
    yield put(actions.goals.saveGoal('interestPromo', {}))
    // when airdrops are running
    // yield put(actions.goals.saveGoal('upgradeForAirdrop'))
    // yield put(actions.goals.saveGoal('airdropClaim'))
  }

  const startSockets = function* () {
    yield put(actions.middleware.webSocket.coins.authSocket())
    yield put(actions.middleware.webSocket.xlm.startStreams())
  }

  const authNabu = function* () {
    yield put(actions.components.identityVerification.fetchSupportedCountries())
    yield take([
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_SUCCESS,
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_FAILURE
    ])
    yield put(actions.modules.profile.signIn())
  }

  const fetchBalances = function* () {
    yield put(actions.core.data.bch.fetchData())
    yield put(actions.core.data.btc.fetchData())
    yield put(actions.core.data.eth.fetchData())
    yield put(actions.core.data.xlm.fetchData())
    yield put(actions.core.data.eth.fetchErc20Data('pax'))
    yield put(actions.core.data.eth.fetchErc20Data('usdt'))
    yield put(actions.core.data.eth.fetchErc20Data('wdgld'))
    yield put(actions.core.data.eth.fetchErc20Data('aave'))
    yield put(actions.core.data.eth.fetchErc20Data('yfi'))
  }

  const checkAndHandleVulnerableAddress = function* (data) {
    const err = prop('error', data)
    const vulnerableAddress = checkForVulnerableAddressError(err)
    if (vulnerableAddress) {
      yield put(actions.modals.closeAllModals())
      const confirmed = yield call(confirm, {
        cancel: C.ARCHIVE_VULNERABLE_ADDRESS_CANCEL,
        confirm: C.ARCHIVE_VULNERABLE_ADDRESS_CONFIRM,
        message: C.ARCHIVE_VULNERABLE_ADDRESS_MSG,
        messageValues: { vulnerableAddress },
        title: C.ARCHIVE_VULNERABLE_ADDRESS_TITLE
      })
      if (confirmed) yield put(actions.core.wallet.setAddressArchived(vulnerableAddress, true))
    }
  }

  const checkDataErrors = function* () {
    const btcDataR = yield select(selectors.core.data.btc.getInfo)

    if (Remote.Loading.is(btcDataR)) {
      const btcData = yield take(actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE)
      const error = prop('payload', btcData)
      yield call(checkAndHandleVulnerableAddress, { error })
    }
    if (Remote.Failure.is(btcDataR)) {
      yield call(checkAndHandleVulnerableAddress, btcDataR)
    }
  }

  const checkExchangeUsage = function* () {
    try {
      const accountsR = yield select(selectors.core.common.btc.getActiveHDAccounts)
      const accounts = accountsR.getOrElse([])
      const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultAccount = accounts.find((account) => account.index === defaultIndex)
      if (!defaultAccount) return
      yield call(api.checkExchangeUsage, defaultAccount.xpub)
    } catch (e) {
      // eslint-disable-next-line
      // console.log(e)
    }
  }

  const setLogoutEventListener = function () {
    return new Promise((resolve) => {
      window.addEventListener('wallet.core.logout', resolve)
    })
  }

  const logoutClearReduxStore = function* () {
    // router will fallback to /login route
    yield window.history.pushState('', '', '#')
    yield window.location.reload(true)
  }

  const logout = function* () {
    try {
      yield put(actions.cache.disconnectChannelPhone())
      yield put(actions.modules.profile.clearSession())
      yield put(actions.middleware.webSocket.rates.stopSocket())
      yield put(actions.middleware.webSocket.coins.stopSocket())
      yield put(actions.middleware.webSocket.xlm.stopStreams())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logout', e))
    } finally {
      const isEmailVerified = (yield select(selectors.core.settings.getEmailVerified)).getOrElse(0)
      // only show browser de-auth page to accounts with verified email
      // delay allows for all actions to run and complete
      // before clearing redux store
      yield delay(100)
      // eslint-disable-next-line no-unused-expressions
      isEmailVerified
        ? yield put(actions.router.push('/logout'))
        : yield call(logoutClearReduxStore)
      // @ts-ignore
      yield put(actions.analytics.stopSession())
    }
  }

  const logoutRoutine = function* () {
    yield call(logout)
  }

  const loginRoutineSaga = function* (mobileLogin, firstLogin) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.auth.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      const invitations = selectors.core.settings
        .getInvitations(yield select())
        .getOrElse(DEFAULT_INVITATIONS)
      const isSegwitEnabled = invitations.segwit
      if (!isLatestVersion && isSegwitEnabled) {
        yield put(actions.auth.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      // Finish upgrades
      yield put(actions.auth.authenticate())
      yield put(actions.auth.setFirstLogin(firstLogin))
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      // If there was no eth metadata kv store entry, we need to create one and that requires the second password.
      yield call(coreSagas.kvStore.eth.fetchMetadataEth, askSecondPasswordEnhancer)
      yield put(actions.middleware.webSocket.xlm.startStreams())
      yield call(coreSagas.kvStore.xlm.fetchMetadataXlm, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield call(coreSagas.kvStore.lockbox.fetchMetadataLockbox)
      yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)
      yield call(coreSagas.data.xlm.fetchLedgerDetails)
      yield call(coreSagas.data.xlm.fetchData)

      if (firstLogin) {
        const countryCode = navigator.language.slice(-2) || 'US'
        const currency = guessCurrencyBasedOnCountry(countryCode)

        yield put(actions.core.settings.setCurrency(currency))
        // fetch settings again
        yield call(coreSagas.settings.fetchSettings)
        yield put(actions.router.push('/verify-email-step'))
      } else {
        yield put(actions.router.push('/home'))
      }

      yield call(authNabu)
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.loginSuccess())
      yield put(actions.auth.startLogoutTimer())
      yield call(startSockets)
      const guid = yield select(selectors.core.wallet.getGuid)
      // store guid in cache for future login
      yield put(actions.cache.guidEntered(guid))
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy('login'))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      yield put(actions.analytics.initUserSession())
      // simple buy tasks
      // only run the fetch simplebuy if there's no simplebuygoal
      const goals = selectors.goals.getGoals(yield select())
      const simpleBuyGoal = find(propEq('name', 'simpleBuy'), goals)
      if (!simpleBuyGoal) {
        yield put(actions.components.simpleBuy.fetchSBPaymentMethods())
      }
      // swap tasks
      yield put(actions.components.swap.fetchTrades())

      // check/update btc account names
      yield call(coreSagas.wallet.checkAndUpdateWalletNames)

      yield fork(checkExchangeUsage)
      yield fork(checkDataErrors)
      // @ts-ignore
      yield fork(logoutRoutine, yield call(setLogoutEventListener))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const pollingSession = function* (session, n = 50) {
    if (n === 0) {
      return false
    }
    try {
      yield delay(2000)
      const response = yield call(api.pollForSessionGUID, session)
      if (prop('guid', response)) {
        return true
      }
    } catch (error) {
      return false
    }
    return yield call(pollingSession, session, n - 1)
  }

  const login = function* (action) {
    const { code, guid, mobileLogin, password, sharedKey } = action.payload
    let session = yield select(selectors.session.getSession, guid)
    yield put(startSubmit('login'))
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
      }
      yield put(actions.session.saveSession(assoc(guid, session, {})))
      yield put(actions.auth.loginLoading())
      yield call(coreSagas.wallet.fetchWalletSaga, {
        code,
        guid,
        password,
        session,
        sharedKey
      })
      // @ts-ignore
      yield call(loginRoutineSaga, mobileLogin)
      yield put(stopSubmit('login'))
    } catch (error) {
      const initialError = prop('initial_error', error)
      const authRequired = prop('authorization_required', error)
      if (authRequired) {
        // This is to test email verification
        // for sso when it starts working
        // const formValues = yield select(selectors.form.getFormValues('login'))
        // const {emailToken} = formValues
        // console.log(emailToken)
        // yield put(actions.core.data.misc.authorizeLogin(emailToken, true))
        // yield delay(2000)
        // const authorized = true
        // auth errors (polling)
        const authRequiredAlert = yield put(
          actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO, undefined, true)
        )

        const authorized = yield call(pollingSession, session)
        yield put(actions.alerts.dismissAlert(authRequiredAlert.payload.id))
        if (authorized) {
          try {
            yield call(coreSagas.wallet.fetchWalletSaga, {
              guid,
              password,
              session
            })
            // @ts-ignore
            yield call(loginRoutineSaga, mobileLogin)
          } catch (error) {
            if (error && error.auth_type > 0) {
              yield put(actions.auth.setAuthType(error.auth_type))
              yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
              yield put(actions.auth.loginFailure(error))
            } else {
              yield put(actions.auth.loginFailure('wrong_wallet_password'))
              yield put(actions.logs.logErrorMessage(logLocation, 'login', error))
            }
          }
        } else {
          yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
        }
      } else if (error && error.auth_type > 0) {
        // 2fa required
        // dispatch state change to show form
        yield put(actions.auth.loginFailure(error))
        yield put(actions.auth.setAuthType(error.auth_type))
        yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
        // Wrong password error
      } else if (error && is(String, error) && error.includes('wrong_wallet_password')) {
        // remove 2fa if password is wrong
        // password error can only occur after 2fa validation
        yield put(actions.auth.setAuthType(0))
        yield put(actions.form.clearFields('login', false, true, 'password', 'code'))
        yield put(actions.form.focus('login', 'password'))
        yield put(actions.auth.loginFailure(error))
      } else if (initialError && initialError.includes('Unknown Wallet Identifier')) {
        yield put(actions.form.change('login', 'step', 'ENTER_EMAIL_GUID'))
        yield put(actions.auth.loginFailure(initialError))
      } else if (error && error.includes('restricted to another IP address.')) {
        yield put(actions.alerts.displayError(C.IPRESTRICTION_LOGIN_ERROR))
        yield put(actions.auth.loginFailure('This wallet is restricted to another IP address.'))
      } else if (
        // Wrong 2fa code error
        error &&
        is(String, error) &&
        error.includes('Authentication code is incorrect')
      ) {
        yield put(actions.form.clearFields('login', false, true, 'code'))
        yield put(actions.form.focus('login', 'code'))
        yield put(actions.auth.loginFailure(error))
      } else if (error && is(String, error)) {
        yield put(actions.auth.loginFailure(error))
      } else {
        const errorMessage = prop('message', error) || 'Error logging into your wallet'
        yield put(actions.auth.loginFailure(errorMessage))
      }
      yield put(stopSubmit('login'))
    }
  }

  const mobileLogin = function* (action) {
    try {
      yield put(actions.auth.mobileLoginStarted())
      yield put(actions.analytics.logEvent(MOBILE_LOGIN.LEGACY))
      const { guid, password, sharedKey } = yield call(
        coreSagas.settings.decodePairingCode,
        action.payload
      )
      const loginAction = actions.auth.login(guid, password, undefined, sharedKey, true)
      yield call(login, loginAction)
      yield put(actions.auth.mobileLoginFinish())
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'mobileLogin', error))
      if (error === 'qr_code_expired') {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED))
      } else {
        yield put(actions.alerts.displayError(C.MOBILE_LOGIN_ERROR))
      }
      yield put(actions.auth.mobileLoginFinish())
    }
  }

  const register = function* (action) {
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.auth.setRegisterEmail(action.payload.email))
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

  const restoreFromMetadata = function* (action) {
    const { mnemonic } = action.payload
    try {
      yield put(actions.auth.restoreFromMetadataLoading())
      // try and pull recovery credentials from metadata
      const metadataInfo = yield call(
        coreSagas.wallet.restoreWalletCredentialsFromMetadata,
        mnemonic
      )
      yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
    } catch (e) {
      yield put(actions.auth.restoreFromMetadataFailure({ e }))
      yield put(actions.logs.logErrorMessage(logLocation, 'restoreFromMetadata', e))
    }
  }

  const restore = function* (action) {
    try {
      yield put(actions.auth.restoreLoading())
      yield put(actions.auth.setRegisterEmail(action.payload.email))
      yield put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
      const kvCredentials = (yield select(selectors.auth.getMetadataRestore)).getOrElse({})
      // TODO: SEGWIT remove w/ DEPRECATED_V3
      yield call(coreSagas.wallet.restoreWalletSaga_DEPRECATED_V3, {
        ...action.payload,
        kvCredentials
      })
      yield put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
      // @ts-ignore
      yield call(loginRoutineSaga, false, true, true)
      yield put(actions.auth.restoreSuccess())
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const resendSmsLoginCode = function* (action) {
    try {
      const { guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid)
      const response = yield call(coreSagas.wallet.resendSmsLoginCode, {
        guid,
        sessionToken
      })
      if (response.initial_error && !response.initial_error.includes('login attempts left')) {
        throw new Error(response)
      } else {
        yield put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resendSmsLoginCode', e))
      yield put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
    }
  }

  const deauthorizeBrowser = function* () {
    try {
      const guid = yield select(selectors.core.wallet.getGuid)
      const sessionToken = yield select(selectors.session.getSession, guid)
      yield call(api.deauthorizeBrowser, sessionToken)
      yield put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
      yield put(actions.cache.disconnectChannelPhone())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', e))
      yield put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
    } finally {
      yield logoutClearReduxStore()
    }
  }

  const initializeLogin = function* () {
    try {
      yield put(A.initializeLoginLoading())
      // Opens coin socket, needed for coin streams and channel key for mobile login
      yield put(actions.ws.startSocket())
      // Grab pathname to determine next step
      // Depending on if pathname is just /login
      // /login/{guid} or /login/{base64_link}
      const pathname = yield select(selectors.router.getPathname)
      const params = pathname.split('/')
      const isMobileConnected = yield select(selectors.cache.getMobileConnected)
      const email = yield select(selectors.cache.getEmail)
      // Check for both stored GUID (from email) and lastGuid (last successful login)
      const storedGuid = yield select(selectors.cache.getStoredGuid)
      const lastGuid = yield select(selectors.cache.getLastGuid)
      if ((storedGuid || lastGuid) && !params[2]) {
        // logic to be compatible with lastGuid in cache make sure that email matches
        // guid being used for login eventually can deprecate after some time
        if (lastGuid === storedGuid) {
          yield put(actions.form.change('login', 'guid', lastGuid))
          yield put(actions.form.change('login', 'email', email))
        } else if (lastGuid) {
          yield put(actions.form.change('login', 'guid', lastGuid))
        } else {
          yield put(actions.form.change('login', 'guid', storedGuid))
          yield put(actions.form.change('login', 'email', email))
        }
        if (isMobileConnected) {
          yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        } else {
          yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        }
        // if url is just /login, take them to enter guid or email
      } else if (!params[2]) {
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
        // we detect a guid in the pathname
      } else if (isGuid(params[2])) {
        const guidFromRoute = params[2]
        yield put(actions.form.change('login', 'guid', guidFromRoute))
        yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        // if path has base64 encrypted JSON
      } else {
        const loginData = JSON.parse(atob(params[2])) as LoginObject
        // grab all the data from the JSON
        const guidFromRoute = prop('guid', loginData)
        const emailFromRoute = prop('email', loginData)
        const mobileSetup = prop('is_mobile_setup', loginData) === 'true'
        const emailToken = prop('email_code', loginData)
        // store data in the cache and update form values
        // to be used to submit login
        yield put(actions.cache.emailStored(emailFromRoute))
        yield put(actions.cache.guidStored(guidFromRoute))
        yield put(actions.cache.mobileConnectedStored(mobileSetup))
        yield put(actions.form.change('login', 'emailToken', emailToken))
        yield put(actions.form.change('login', 'guid', guidFromRoute))
        yield put(actions.form.change('login', 'email', emailFromRoute))
        // check if mobile detected
        if (mobileSetup) {
          yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        } else {
          yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        }
      }
      yield put(A.initializeLoginSuccess())
    } catch (e) {
      yield put(A.initializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeLogin', e))
    }
  }

  // triggers verification email for login
  const loginGuid = function* (action) {
    const formValues = yield select(selectors.form.getFormValues('login'))
    const { step } = formValues
    yield put(startSubmit('login'))
    try {
      yield put(A.loginGuidLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(coreSagas.wallet.loginGuidSaga, action.payload, sessionToken)
      if (step === LoginSteps.CHECK_EMAIL) {
        yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
      } else {
        yield put(actions.form.change('login', 'step', LoginSteps.CHECK_EMAIL))
      }
      yield put(stopSubmit('login'))
      yield put(A.loginGuidSuccess())
    } catch (e) {
      yield put(A.loginGuidFailure())
      yield put(stopSubmit('login'))
      yield put(actions.logs.logErrorMessage(logLocation, 'loginGuid', e))
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
    }
  }

  return {
    authNabu,
    checkAndHandleVulnerableAddress,
    checkDataErrors,
    deauthorizeBrowser,
    initializeLogin,
    login,
    loginGuid,
    loginRoutineSaga,
    logout,
    logoutClearReduxStore,
    logoutRoutine,
    mobileLogin,
    pollingSession,
    register,
    resendSmsLoginCode,
    restore,
    restoreFromMetadata,
    saveGoals,
    setLogoutEventListener,
    startSockets,
    upgradeAddressLabelsSaga,
    upgradeWallet
  }
}
