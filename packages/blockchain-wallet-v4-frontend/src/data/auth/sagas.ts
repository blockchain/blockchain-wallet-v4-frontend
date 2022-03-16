import base64url from 'base64url'
import { assoc, find, propEq } from 'ramda'
import { startSubmit, stopSubmit } from 'redux-form'
import { call, fork, put, select, take } from 'redux-saga/effects'

import { DEFAULT_INVITATIONS } from '@core/model'
import { WalletOptionsType } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, actionTypes, selectors } from 'data'
import { fetchBalances } from 'data/balance/sagas'
import goalSagas from 'data/goals/sagas'
import miscSagas from 'data/misc/sagas'
import profileSagas from 'data/modules/profile/sagas'
import walletSagas from 'data/wallet/sagas'
import * as C from 'services/alerts'
import { isGuid } from 'services/forms'
import { getFiatCurrencyFromCountry } from 'services/locales'
import { askSecondPasswordEnhancer } from 'services/sagas'

import { initMobileWalletAuthFlow, sendMessageToMobile } from './sagas.mobile'
import {
  determineAuthenticationFlow,
  pollForSessionFromAuthPayload,
  pollForSessionFromGuid
} from './sagas.utils'
import * as S from './selectors'
import {
  AccountUnificationFlows,
  AuthMagicLink,
  LoginErrorType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from './types'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'auth/sagas'
  const { createUser, generateRetailToken, setSession } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const {
    checkDataErrors,
    checkXpubCacheLegitimacy,
    updateMnemonicBackup,
    upgradeAddressLabelsSaga
  } = walletSagas({
    coreSagas
  })
  const { saveGoals } = goalSagas({ api, coreSagas, networks })
  const { startCoinWebsockets } = miscSagas()

  const LOGIN_FORM = 'login'

  const authNabu = function* () {
    yield put(actions.components.identityVerification.fetchSupportedCountries())
    yield take([
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_SUCCESS,
      actionTypes.components.identityVerification.SET_SUPPORTED_COUNTRIES_FAILURE
    ])
    yield put(actions.modules.profile.signIn())
  }

  const exchangeResetPassword = function* (action) {
    const email = action.payload
    yield put(actions.auth.exchangeResetPasswordLoading())
    yield put(startSubmit('exchangePasswordReset'))
    try {
      const response = yield call(api.exchangeResetPassword, email)
      yield put(stopSubmit('exchangePasswordReset'))
      yield put(actions.auth.exchangeResetPasswordSuccess(response))
    } catch (e) {
      yield put(actions.auth.exchangeResetPasswordFailure(e))
      yield put(stopSubmit('exchangePasswordReset'))
    }
  }

  const exchangeLogin = function* (action) {
    const { code, password, username } = action.payload
    const { userType } = yield select(selectors.auth.getProductAuthMetadata)
    const unificationFlowType = yield select(selectors.auth.getAccountUnificationFlowType)
    const { platform } = yield select(selectors.auth.getProductAuthMetadata)
    const magicLinkData: AuthMagicLink = yield select(S.getMagicLinkData)
    const exchangeAuthUrl = magicLinkData?.exchange_auth_url
    const { comRoot: institutionalDomain, exchange: exchangeDomain } = selectors.core.walletOptions
      .getDomains(yield select())
      .getOrElse({
        exchange: 'https://exchange.blockchain.com'
      } as WalletOptionsType['domains'])
    const institutionalPortalEnabled = (yield select(
      selectors.core.walletOptions.getInstitutionalPortalEnabled
    )).getOrElse(false)
    yield put(startSubmit(LOGIN_FORM))
    // analytics
    if (code) {
      yield put(actions.auth.analyticsLoginTwoStepVerificationEntered())
    } else {
      yield put(actions.auth.analyticsLoginPasswordEntered())
    }
    // start signin flow
    try {
      const response = yield call(api.exchangeSignIn, code, password, username)
      const { csrfToken, token: jwtToken } = response
      yield put(actions.auth.setJwtToken(jwtToken))
      // determine login flow
      switch (true) {
        // account merge/upgrade web
        case unificationFlowType ===
          (AccountUnificationFlows.EXCHANGE_MERGE || AccountUnificationFlows.EXCHANGE_UPGRADE):
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_CONFIRM))
          yield put(stopSubmit(LOGIN_FORM))
          break
        // account merge mobile
        case unificationFlowType === AccountUnificationFlows.MOBILE_EXCHANGE_MERGE:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
          yield put(stopSubmit(LOGIN_FORM))
          break
        // account upgrade mobile
        case unificationFlowType === AccountUnificationFlows.MOBILE_EXCHANGE_UPGRADE:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_PASSWORD))
          yield put(stopSubmit(LOGIN_FORM))
          break
        // web - institutional exchange login
        case userType === 'institutional' && institutionalPortalEnabled:
          window.open(
            `${institutionalDomain}/institutional/portal/?jwt=${jwtToken}`,
            '_self',
            'noreferrer'
          )
          break
        // mobile - exchange sso login
        case platform !== PlatformTypes.WEB:
          sendMessageToMobile(platform, {
            data: { csrf: csrfToken, jwt: jwtToken },
            status: 'success'
          })
          break
        // web - exchange sso login
        case exchangeAuthUrl !== undefined && platform === PlatformTypes.WEB:
          window.open(`${exchangeAuthUrl}${jwtToken}&csrf=${csrfToken}`, '_self', 'noreferrer')
          break
        default:
          // case where user has email cached and is
          // logging in without triggering verify email template
          window.open(`${exchangeDomain}/trade/auth?jwt=${jwtToken}`, '_self', 'noreferrer')
          break
      }
      // @ts-ignore
    } catch (e: { code?: number }) {
      yield put(actions.auth.exchangeLoginFailure(e.code))
      if (e.code && e.code === 11) {
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.TWO_FA_EXCHANGE))
      }
      if (e.code && e.code === 10) {
        yield put(actions.auth.analyticsLoginTwoStepVerificationDenied())
      }
      if (e.code && e.code === 8) {
        yield put(actions.auth.analyticsLoginPasswordDenied())
      }
      yield put(stopSubmit(LOGIN_FORM))
    }
  }

  const checkWalletDerivationsLegitimacy = function* () {
    const accounts = yield call(coreSagas.wallet.getAccountsWithIncompleteDerivations)

    if (accounts.length > 0) {
      yield call(coreSagas.wallet.replenishDerivations, accounts)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const loginRoutineSaga = function* ({
    country = undefined,
    email = undefined,
    firstLogin = false,
    recovery = false,
    state = undefined
  }) {
    try {
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.wallet.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      const invitations = selectors.core.settings
        .getInvitations(yield select())
        .getOrElse(DEFAULT_INVITATIONS)
      const isSegwitEnabled = invitations.segwit
      if (!isLatestVersion && isSegwitEnabled) {
        yield put(actions.wallet.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isAccountReset: boolean = yield select(selectors.auth.getAccountReset)
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

      yield call(authNabu)

      if (firstLogin) {
        const countryCode = country || 'US'
        const currency = getFiatCurrencyFromCountry(countryCode)

        yield put(actions.modules.settings.updateCurrency(currency, true))
        yield put(actions.core.settings.setCurrency(currency))

        if (!isAccountReset) {
          yield put(actions.router.push('/verify-email-step'))
        } else {
          yield put(actions.router.push('/home'))
        }
      } else {
        yield put(actions.router.push('/home'))
      }
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.loginSuccess(true))
      yield put(actions.auth.startLogoutTimer())
      yield call(startCoinWebsockets)
      const guid = yield select(selectors.core.wallet.getGuid)
      // store guid and email in cache for future login
      yield put(actions.cache.guidEntered(guid))
      if (email) {
        yield put(actions.cache.emailStored(email))
      }
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy(LOGIN_FORM))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      // simple buy tasks
      // only run the fetch simplebuy if there's no simplebuygoal
      const goals = selectors.goals.getGoals(yield select())
      const buySellGoal = find(propEq('name', 'buySell'), goals)
      if (!buySellGoal) {
        yield put(actions.components.buySell.fetchPaymentMethods())
      }
      // swap tasks
      yield put(actions.components.swap.fetchTrades())
      // check/update btc account names
      yield call(coreSagas.wallet.checkAndUpdateWalletNames)
      const signupCountryEnabled = (yield select(
        selectors.core.walletOptions.getFeatureSignupCountry
      )).getOrElse(false)
      if (firstLogin && signupCountryEnabled && !isAccountReset && !recovery) {
        // create nabu user
        yield call(createUser)
        // store initial address in case of US state we add prefix
        const userState = country === 'US' ? `US-${state}` : state
        yield call(api.setUserInitialAddress, country, userState)
        yield call(coreSagas.settings.fetchSettings)
      }
      // We are checking wallet metadata to see if mnemonic is verified
      // and then syncing that information with new Wallet Account model
      // being used for SSO
      yield fork(updateMnemonicBackup)
      // ensure xpub cache is correct
      yield fork(checkXpubCacheLegitimacy)
      // ensure derivations are correct
      yield fork(checkWalletDerivationsLegitimacy)
      yield fork(checkDataErrors)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const login = function* (action) {
    const { code, guid, password, sharedKey } = action.payload
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const { email, emailToken } = formValues
    const accountUpgradeFlow = yield select(S.getAccountUnificationFlowType)
    const product = yield select(S.getProduct)
    let session = yield select(selectors.session.getSession, guid, email)
    // JUST FOR ANALYTICS PURPOSES
    if (code) {
      yield put(actions.auth.analyticsLoginTwoStepVerificationEntered())
    } else {
      yield put(actions.auth.analyticsLoginPasswordEntered())
    }
    // JUST FOR ANALYTICS PURPOSES
    yield put(startSubmit(LOGIN_FORM))
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
        yield put(actions.session.saveSession(assoc(guid, session, {})))
      }
      yield put(actions.auth.loginLoading())
      if (emailToken) {
        yield call(
          coreSagas.data.misc.authorizeLogin,
          actions.core.data.misc.authorizeLogin(emailToken, true, session)
        )
        if ((yield select(selectors.core.data.misc.authorizeLogin)).error?.includes('mismatch')) {
          yield put(actions.alerts.displayError(C.DEVICE_MISMATCH))
          yield put(stopSubmit(LOGIN_FORM))
          return
        }
      }
      yield call(coreSagas.wallet.fetchWalletSaga, {
        code,
        guid,
        password,
        session,
        sharedKey
      })
      // Check which unification flow we're running
      // to determine what we want to do after authing user
      switch (true) {
        case accountUpgradeFlow === AccountUnificationFlows.WALLET_MERGE:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_CONFIRM))
          break
        case accountUpgradeFlow === AccountUnificationFlows.MOBILE_WALLET_MERGE:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
          break
        case accountUpgradeFlow === AccountUnificationFlows.EXCHANGE_MERGE ||
          accountUpgradeFlow === AccountUnificationFlows.MOBILE_EXCHANGE_MERGE:
          // call action to merge account
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_SUCCESS))
          break
        // if account is unified, we have
        case accountUpgradeFlow === AccountUnificationFlows.UNIFIED:
          if (product === ProductAuthOptions.WALLET) {
            yield call(loginRoutineSaga, {})
          } else if (product === ProductAuthOptions.EXCHANGE) {
            // CODE HERE TO AUTOMATICALLY DIRECT TO EXCHANGE
          } else {
            // If product is undefined, show user product picker to choose
            actions.form.change(LOGIN_FORM, 'step', LoginSteps.PRODUCT_PICKER_AFTER_AUTHENTICATION)
          }
          break
        default:
          yield call(loginRoutineSaga, {})
          break
      }
      yield put(stopSubmit(LOGIN_FORM))
    } catch (e) {
      const error = e as LoginErrorType
      const initialError = typeof error !== 'string' && error.initial_error
      const errorString = typeof error === 'string' && error
      switch (true) {
        // Email authorization is required for login
        case typeof error !== 'string' && error.authorization_required:
          const authRequiredAlert = yield put(
            actions.alerts.displayInfo(C.AUTHORIZATION_REQUIRED_INFO, undefined, true)
          )
          // polling for email authorization
          const authorized = yield call(pollForSessionFromGuid, api, session)
          yield put(actions.alerts.dismissAlert(authRequiredAlert.payload.id))
          if (authorized) {
            try {
              yield call(coreSagas.wallet.fetchWalletSaga, {
                guid,
                password,
                session
              })
              if (accountUpgradeFlow === AccountUnificationFlows.WALLET_MERGE) {
                yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_CONFIRM))
              } else {
                yield call(loginRoutineSaga, {})
              }
            } catch (e) {
              // If error is that 2fa is required
              const error = e as LoginErrorType
              if (typeof error !== 'string' && error?.auth_type > 0) {
                yield put(actions.auth.setAuthType(error.auth_type))
                yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
                yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.TWO_FA_WALLET))
                yield put(actions.auth.loginFailure(undefined))
                // otherwise only other error could be wrong wallet password
              } else {
                yield put(actions.auth.loginFailure('wrong_wallet_password'))
                yield put(actions.logs.logErrorMessage(logLocation, 'login', error))
              }
            }
          } else {
            yield put(actions.alerts.displayError(C.WALLET_SESSION_ERROR))
          }
          break
        // 2FA is required for sign in
        case typeof error !== 'string' && error.auth_type > 0:
          yield put(actions.auth.loginFailure(undefined))
          yield put(actions.auth.setAuthType(typeof error !== 'string' && error.auth_type))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.TWO_FA_WALLET))
          yield put(actions.alerts.displayInfo(C.TWOFA_REQUIRED_INFO))
          break
        // Wrong wallet password error is just returned as a string
        case errorString && errorString.includes('wrong_wallet_password'):
          // remove 2fa if password is wrong by setting auth type to zero
          // TODO: check on why we do this
          yield put(actions.auth.setAuthType(0))
          yield put(actions.form.clearFields(LOGIN_FORM, false, true, 'password', 'code'))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
          yield put(actions.form.focus(LOGIN_FORM, 'password'))
          yield put(actions.auth.analyticsLoginPasswordDenied())
          yield put(actions.auth.loginFailure(errorString))
          break
        // Valid wallet ID format but it doesn't exist in bc
        case initialError && initialError.includes('Unknown Wallet Identifier'):
          yield put(actions.form.change(LOGIN_FORM, 'step', 'ENTER_EMAIL_GUID'))
          yield put(actions.auth.loginFailure(initialError))
          break
        // Security feature where user can restrict access to whitelisted IPs only
        case errorString && errorString.includes('restricted to another IP address.'):
          yield put(actions.alerts.displayError(C.IPRESTRICTION_LOGIN_ERROR))
          yield put(actions.auth.loginFailure('This wallet is restricted to another IP address.'))
          break
        // Account locked due to too many failed 2fa attemps
        case errorString && errorString.includes('is locked'):
          yield put(actions.form.clearFields(LOGIN_FORM, false, true, 'locked'))
          yield put(actions.auth.loginFailure(errorString))
          break
        // Wrong 2fa code error
        case errorString &&
          (errorString.includes('Authentication code is incorrect') ||
            errorString.includes('Invalid authentication code')):
          yield put(actions.form.clearFields(LOGIN_FORM, false, true, 'code'))
          yield put(actions.form.focus(LOGIN_FORM, 'code'))
          yield put(actions.auth.loginFailure(errorString))
          yield put(actions.auth.analyticsLoginTwoStepVerificationDenied())
          break
        // Catch all to show whatever error string is returned
        case errorString:
          yield put(actions.auth.loginFailure(errorString))
          break
        default:
          const errorMessage =
            (typeof error !== 'string' && error?.message) || 'Error logging into your wallet'
          yield put(actions.auth.loginFailure(errorMessage))
      }
      yield put(stopSubmit(LOGIN_FORM))
    }
  }

  const mobileLogin = function* (action) {
    try {
      yield put(actions.auth.mobileLoginStarted())
      const { guid, password, sharedKey } = yield call(
        coreSagas.settings.decodePairingCode,
        action.payload
      )
      const loginAction = actions.auth.login({
        code: undefined,
        guid,
        mobileLogin: true,
        password,
        sharedKey
      })
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
    const { country, email, initCaptcha, state } = action.payload
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    // Want this behind a feature flag to monitor
    // if this thing could be abused or not
    const refreshToken = (yield select(
      selectors.core.walletOptions.getRefreshCaptchaOnSignupError
    )).getOrElse(false)
    try {
      yield put(actions.auth.registerLoading())
      yield put(actions.auth.setRegisterEmail(email))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      if (formValues?.step === LoginSteps.UPGRADE_PASSWORD) {
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_SUCCESS))
      } else {
        // TODO: want to pull user country off of exchange profile
        yield put(actions.auth.signupDetailsEntered({ country, countryState: state }))
        yield call(loginRoutineSaga, {
          country,
          email,
          firstLogin: true,
          state
        })
      }
      yield put(actions.auth.registerSuccess(undefined))
    } catch (e) {
      yield put(actions.auth.registerFailure(undefined))
      yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
      yield put(actions.alerts.displayError(C.REGISTER_ERROR))
      if (refreshToken) {
        initCaptcha()
      }
    }
  }

  const restoreFromMetadata = function* (action) {
    const mnemonic = action.payload
    try {
      yield put(actions.auth.restoreFromMetadataLoading())
      // try and pull recovery credentials from metadata
      const metadataInfo = yield call(
        coreSagas.wallet.restoreWalletCredentialsFromMetadata,
        mnemonic
      )
      const { guid, sharedKey } = metadataInfo
      // during recovery, we reset user kyc and generate a retail token from nabu using guid/shared key
      const { token } = yield call(api.generateRetailToken, guid, sharedKey)
      // pass that token to /user. if a user already exists, it returns
      // information associated with that user
      const { created, token: lifetimeToken, userId } = yield call(api.createUser, token)
      // if the recovered user never had a nabu account, we're creating a new user
      // so created will return true. No need to reset their kyc
      if (!created) {
        try {
          // call reset kyc
          yield call(api.resetUserKyc, userId, lifetimeToken, token)
          yield put(actions.auth.setKycResetStatus(true))
          yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
          // @ts-ignore
        } catch (e: { status?: number }) {
          // if it fails with user already being reset, should be allowed
          // to continue with flow
          if (e && e.status === 409) {
            yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
            yield put(actions.auth.setKycResetStatus(true))
          } else {
            yield put(actions.alerts.displayError(C.KYC_RESET_ERROR))
            yield put(actions.auth.restoreFromMetadataFailure(errorHandler(e)))
            yield put(actions.auth.setKycResetStatus(false))
          }
        }
      } else {
        yield put(actions.auth.restoreFromMetadataSuccess(metadataInfo))
      }
    } catch (e) {
      yield put(actions.auth.restoreFromMetadataFailure(errorHandler(e)))
      yield put(actions.logs.logErrorMessage(logLocation, 'restoreFromMetadata', e))
    }
  }

  const restore = function* (action) {
    try {
      const { captchaToken, email, language, mnemonic, password } = action.payload
      const kvCredentials = (yield select(selectors.auth.getMetadataRestore)).getOrElse({})

      yield put(actions.auth.restoreLoading())
      yield put(actions.auth.setRegisterEmail(email))
      yield put(actions.alerts.displayInfo(C.RESTORE_WALLET_INFO))
      yield call(coreSagas.wallet.restoreWalletSaga, {
        captchaToken,
        email,
        kvCredentials,
        language,
        mnemonic,
        password
      })

      yield call(loginRoutineSaga, {
        email,
        firstLogin: true,
        recovery: true
      })
      yield put(actions.alerts.displaySuccess(C.RESTORE_SUCCESS))
      yield put(actions.auth.restoreSuccess(undefined))
    } catch (e) {
      yield put(actions.auth.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const resendSmsLoginCode = function* (action) {
    try {
      const { email, guid } = action.payload
      const sessionToken = yield select(selectors.session.getSession, guid, email)
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

  const initializeLogin = function* () {
    try {
      // set loading
      yield put(actions.auth.initializeLoginLoading())
      // open coin ws needed for coin streams and channel key for mobile login
      yield put(actions.ws.startSocket())
      // get product auth data from querystring
      const queryParams = new URLSearchParams(yield select(selectors.router.getSearch))
      // get device platform param or default to web
      const platform = (queryParams.get('platform') || PlatformTypes.WEB) as PlatformTypes
      // get product param or default to wallet
      const product = (queryParams.get('product')?.toUpperCase() ||
        ProductAuthOptions.WALLET) as ProductAuthOptions
      const userType = queryParams.get('userType') as string
      // store product auth data defaulting to product=wallet and platform=web
      yield put(
        actions.auth.setProductAuthMetadata({
          platform,
          product,
          redirect: queryParams.get('redirect') || undefined,
          userType
        })
      )
      // select required data to initialize auth below
      const pathname = yield select(selectors.router.getPathname)
      const urlPathParams = pathname.split('/')
      const walletGuidOrMagicLinkFromUrl = urlPathParams[2]
      const storedGuid = yield select(selectors.cache.getStoredGuid)
      const lastGuid = yield select(selectors.cache.getLastGuid)
      const exchangeEmail = yield select(selectors.cache.getExchangeEmail)
      // This is the product that we set based on query param or cache
      // It can be undefined as well, and we use this to show them the product picker
      // initialize login form and/or set initial auth step
      // 👋 Case order matters, think before changing!
      switch (true) {
        // wallet mobile webview auth flow
        case platform !== PlatformTypes.WEB && product === ProductAuthOptions.WALLET:
          yield call(initMobileWalletAuthFlow)
          break
        // institutional login portal for Prime exchange users
        case userType === 'institutional':
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.INSTITUTIONAL_PORTAL))
          break
        // no guid on path, use cached/stored guid if exists
        case (storedGuid || lastGuid) &&
          !walletGuidOrMagicLinkFromUrl &&
          product === ProductAuthOptions.WALLET:
          // change product param in url to make it clear to user
          yield put(actions.router.push('/login?product=wallet'))
          // select required data
          const email = yield select(selectors.cache.getEmail)
          // logic to be compatible with lastGuid in cache make sure that email matches
          // guid being used for login eventually can be cleared after some time
          yield put(actions.form.change(LOGIN_FORM, 'guid', lastGuid || storedGuid))
          yield put(actions.form.change(LOGIN_FORM, 'email', email))
          // determine initial step
          const initialStep =
            product === ProductAuthOptions.EXCHANGE
              ? LoginSteps.ENTER_PASSWORD_EXCHANGE
              : LoginSteps.ENTER_PASSWORD_WALLET
          yield put(actions.form.change(LOGIN_FORM, 'step', initialStep))
          break
        // url is just /login, take them to enter guid or email
        case !walletGuidOrMagicLinkFromUrl:
          if (product === ProductAuthOptions.WALLET) {
            yield put(actions.router.push('/login?product=wallet'))
            yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
          }
          if (product === ProductAuthOptions.EXCHANGE) {
            if (exchangeEmail) {
              yield put(actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail))
              yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
            } else {
              yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
            }
          }
          break
        // guid is on the url e.g. login/{guid}
        case isGuid(walletGuidOrMagicLinkFromUrl):
          yield put(actions.router.push('/login?product=wallet'))
          yield put(actions.form.change(LOGIN_FORM, 'guid', walletGuidOrMagicLinkFromUrl))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
          break
        // url has base64 encrypted magic link JSON
        default:
          yield put(actions.auth.setMagicLinkInfoEncoded(walletGuidOrMagicLinkFromUrl))
          const authMagicLink = JSON.parse(
            base64url.decode(walletGuidOrMagicLinkFromUrl)
          ) as AuthMagicLink
          yield put(actions.auth.setMagicLinkInfo(authMagicLink))
          // check querystring to determine if mobile has already completed the device polling
          yield call(determineAuthenticationFlow, queryParams.has('skipSessionCheck'))
      }

      // hide loading and ensure latest app version
      yield put(actions.auth.initializeLoginSuccess())
      yield put(actions.misc.pingManifestFile())
    } catch (e) {
      yield put(actions.auth.initializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeLogin', e))
    }
  }

  // this is the function we run when submitting the login form
  const continueLoginProcess = function* (action) {
    const { captchaToken, initCaptcha } = action.payload
    const {
      code,
      email,
      exchangeEmail,
      exchangePassword,
      exchangeTwoFA,
      guid,
      guidOrEmail,
      password,
      step,
      upgradeAccountPassword
    } = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const authType = yield select(selectors.auth.getAuthType)
    const language = yield select(selectors.preferences.getLanguage)
    const product = yield select(S.getProduct)
    try {
      // set code to uppercase if type is not yubikey
      let auth = code
      if (auth && authType !== 1) {
        auth = auth.toUpperCase()
      }
      // CHECKS FORM STEP TO SEE IF WE WANT TO TRIGGER THE VERIFICATION LINK
      if (step === LoginSteps.ENTER_EMAIL_GUID || step === LoginSteps.CHECK_EMAIL) {
        // If it's a guid, we take them to the enter mobile verification step
        if (isGuid(guidOrEmail) && product === ProductAuthOptions.WALLET) {
          yield put(actions.form.change(LOGIN_FORM, 'guid', guidOrEmail))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
        } else if (product === ProductAuthOptions.EXCHANGE) {
          // trigger email for exchange form
          yield put(actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail))
          yield put(
            actions.auth.triggerWalletMagicLink({
              captchaToken,
              email: exchangeEmail
            })
          )
          initCaptcha()
        } else {
          // trigger email from wallet form
          yield put(actions.form.change(LOGIN_FORM, 'email', email || guidOrEmail))
          yield put(
            actions.auth.triggerWalletMagicLink({
              captchaToken,
              email: email || guidOrEmail
            })
          )
          initCaptcha()
        }
        // Passing ID type used to analytics
        const idType = isGuid(guidOrEmail) ? 'WALLET_ID' : 'EMAIL'
        yield put(actions.auth.analyticsLoginIdEntered(idType))
      } else if (step === LoginSteps.ENTER_PASSWORD_WALLET || step === LoginSteps.TWO_FA_WALLET) {
        yield put(
          actions.auth.login({ code: auth, guid, mobileLogin: null, password, sharedKey: null })
        )
      } else if (step === LoginSteps.UPGRADE_PASSWORD) {
        yield put(
          actions.auth.register({
            country: undefined,
            email,
            language,
            password: upgradeAccountPassword,
            state: undefined
          })
        )
      } else {
        // User only has an exchange account to far, and they're 'upgrading'
        // i.e. creating a new wallet and merging it to their exchange account
        yield put(
          actions.auth.exchangeLogin({
            code: exchangeTwoFA,
            password: exchangePassword,
            username: exchangeEmail
          })
        )
      }
    } catch (e) {
      // TODO add catch error state
    }
  }

  // triggers verification email for login
  const triggerWalletMagicLink = function* (action) {
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const { product } = yield select(selectors.auth.getProductAuthMetadata)
    const { step } = formValues
    const { captchaToken, email } = action.payload
    yield put(startSubmit(LOGIN_FORM))
    try {
      yield put(actions.auth.triggerWalletMagicLinkLoading())
      let sessionToken
      if (step === LoginSteps.CHECK_EMAIL && product === ProductAuthOptions.EXCHANGE) {
        sessionToken = yield select(selectors.session.getSession, null, email)
        if (!sessionToken) {
          sessionToken = yield call(api.obtainSessionToken)
          yield put(actions.session.saveSession(assoc(email, sessionToken, {})))
        }
      } else {
        sessionToken = yield call(api.obtainSessionToken)
        yield put(actions.session.saveSession(assoc(email, sessionToken, {})))
      }
      yield call(api.triggerWalletMagicLink, sessionToken, email, captchaToken, product)
      if (step === LoginSteps.CHECK_EMAIL) {
        yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
      } else {
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.CHECK_EMAIL))
      }
      yield put(actions.auth.triggerWalletMagicLinkSuccess())
      yield put(stopSubmit(LOGIN_FORM))
      // poll for session from auth payload
      yield call(pollForSessionFromAuthPayload, api, sessionToken)
    } catch (e) {
      yield put(actions.auth.triggerWalletMagicLinkFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'triggerWalletMagicLink', e))
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
      yield put(stopSubmit(LOGIN_FORM))
    }
  }

  const authorizeVerifyDevice = function* (action) {
    const confirmDevice = action.payload
    const magicLinkDataEncoded = yield select(selectors.auth.getMagicLinkDataEncoded)
    const { product, session_id, wallet } = yield select(selectors.auth.getMagicLinkData)
    const exchange_only_login = product === ProductAuthOptions.EXCHANGE || !wallet

    try {
      yield put(actions.auth.authorizeVerifyDeviceLoading())
      if (!magicLinkDataEncoded) return
      const data = yield call(
        api.authorizeVerifyDevice,
        session_id,
        magicLinkDataEncoded,
        confirmDevice,
        exchange_only_login
      )
      if (data.success) {
        yield put(actions.auth.authorizeVerifyDeviceSuccess({ deviceAuthorized: true }))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceSuccess())
      }
      // @ts-ignore
    } catch (e: { confirmation_required: boolean; status?: number }) {
      if (e && e.status === 401 && e.confirmation_required) {
        yield put(actions.auth.authorizeVerifyDeviceSuccess(e))
      } else if (e && e.status === 409 && e.request_denied) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('REJECTED'))
      } else if (e && e.status === 400 && e.link_expired) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('EXPIRED'))
      } else {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e.error))
        yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('UNKNOWN'))
      }
    }
  }

  const resetAccount = function* (action) {
    // if user is resetting their custodial account
    // create a new wallet and assign an existing custodial account to that wallet
    yield put(actions.auth.resetAccountLoading())
    try {
      const { email, language, password } = action.payload
      // get recovery token and nabu ID
      const magicLinkData: AuthMagicLink = yield select(S.getMagicLinkData)
      const recoveryToken = magicLinkData.wallet?.nabu?.recovery_token
      const userId = magicLinkData.wallet?.nabu?.user_id
      yield put(actions.auth.setResetAccount(true))
      // create a new wallet
      yield call(register, actions.auth.register({ email, language, password }))
      const guid = yield select(selectors.core.wallet.getGuid)
      // generate a retail token for new wallet
      const retailToken = yield call(generateRetailToken)
      // call the reset nabu user endpoint, receive new lifetime token for nabu user
      const { token: lifetimeToken } = yield call(
        api.resetUserAccount,
        userId,
        recoveryToken,
        retailToken
      )
      // set new lifetime token for user in metadata
      yield put(actions.core.kvStore.userCredentials.setUserCredentials(userId, lifetimeToken))
      // fetch user in new wallet
      yield call(setSession, userId, lifetimeToken, email, guid)
      yield put(actions.auth.resetAccountSuccess())
    } catch (e) {
      yield put(actions.auth.resetAccountFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'resetAccount', e))
      yield put(actions.modals.showModal('RESET_ACCOUNT_FAILED', { origin: 'ResetAccount' }))
    }
  }

  return {
    authNabu,
    authorizeVerifyDevice,
    continueLoginProcess,
    exchangeLogin,
    exchangeResetPassword,
    initializeLogin,
    login,
    loginRoutineSaga,
    mobileLogin,
    register,
    resendSmsLoginCode,
    resetAccount,
    restore,
    restoreFromMetadata,
    triggerWalletMagicLink
  }
}
