import base64url from 'base64url'
import { find, propEq } from 'ramda'
import { startSubmit, stopSubmit } from 'redux-form'
import { all, call, fork, put, select, take } from 'redux-saga/effects'

import { CountryScope, WalletOptionsType } from '@core/types'
import { actions, actionTypes, selectors } from 'data'
import { ClientErrorProperties } from 'data/analytics/types/errors'
import { fetchBalances } from 'data/balances/sagas'
import { actions as identityVerificationActions } from 'data/components/identityVerification/slice'
import goalSagas from 'data/goals/sagas'
import miscSagas from 'data/misc/sagas'
import profileSagas from 'data/modules/profile/sagas'
import {
  Analytics,
  CaptchaActionName,
  ExchangeAuthOriginType,
  ExchangeErrorCodes,
  LoginRoutinePayloadType
} from 'data/types'
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
  AuthUserType,
  LoginApiErrorType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from './types'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'auth/sagas'
  const { createExchangeUser, createUser } = profileSagas({
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
  const { generateCaptchaToken, startCoinWebsockets } = miscSagas()

  const LOGIN_FORM = 'login'

  const authNabu = function* () {
    yield put(
      actions.components.identityVerification.fetchSupportedCountries({ scope: CountryScope.KYC })
    )
    yield take([
      identityVerificationActions.setSupportedCountriesSuccess.type,
      identityVerificationActions.setSupportedCountriesFailure.type
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
    yield put(startSubmit(LOGIN_FORM))
    const { code, password, username } = action.payload
    const { platform, product, redirect, userType } = yield select(
      selectors.auth.getProductAuthMetadata
    )
    const magicLinkData: AuthMagicLink = yield select(S.getMagicLinkData)
    const exchangeAuthUrl = magicLinkData?.exchange_auth_url
    const { exchange: exchangeDomain } = selectors.core.walletOptions
      .getDomains(yield select())
      .getOrElse({
        exchange: 'https://exchange.blockchain.com'
      } as WalletOptionsType['domains'])
    const institutionalPortalEnabled = (yield select(
      selectors.core.walletOptions.getInstitutionalPortalEnabled
    )).getOrElse(false)

    if (code) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_TWO_STEP_VERIFICATION_ENTERED,
          properties: {
            device_origin: platform,
            site_redirect: product,
            unified: false
          }
        })
      )
    } else {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_PASSWORD_ENTERED,
          properties: {
            device_origin: platform,
            site_redirect: product,
            unified: false
          }
        })
      )
    }
    // start signin flow
    try {
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.LOGIN)
      const response = yield call(api.exchangeSignIn, captchaToken, code, password, username)
      const { csrfToken, sessionExpirationTime, token: jwtToken } = response
      yield put(actions.auth.setJwtToken(jwtToken))

      // determine login flow method and save the result so we can run after analytics
      let finalizeLoginMethod
      switch (true) {
        // account merge/upgrade web
        // case unificationFlowType ===
        //   (AccountUnificationFlows.EXCHANGE_MERGE || AccountUnificationFlows.EXCHANGE_UPGRADE):
        //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_CONFIRM))
        //   yield put(stopSubmit(LOGIN_FORM))
        //   break
        // // account merge mobile
        // case unificationFlowType === AccountUnificationFlows.MOBILE_EXCHANGE_MERGE:
        //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
        //   yield put(stopSubmit(LOGIN_FORM))
        //   break
        // // account upgrade mobile
        // case unificationFlowType === AccountUnificationFlows.MOBILE_EXCHANGE_UPGRADE:
        //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_PASSWORD))
        //   yield put(stopSubmit(LOGIN_FORM))
        //   break

        // web - institutional exchange login
        // only institutional users coming from the .com page will have
        // a redirect link. All other users coming from footer in login page
        // should be redirected to regular exchange app in the default case
        case userType === AuthUserType.INSTITUTIONAL && !!redirect && institutionalPortalEnabled:
          finalizeLoginMethod = () =>
            window.open(`${redirect}?jwt=${jwtToken}`, '_self', 'noreferrer')
          break
        // mobile - exchange sso login
        case platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS:
          finalizeLoginMethod = () =>
            sendMessageToMobile(platform, {
              data: { csrf: csrfToken, jwt: jwtToken, jwtExpirationTime: sessionExpirationTime },
              status: 'success'
            })
          break
        case typeof exchangeAuthUrl === 'string' && platform === PlatformTypes.WEB:
          finalizeLoginMethod = () =>
            window.open(`${exchangeAuthUrl}${jwtToken}&csrf=${csrfToken}`, '_self', 'noreferrer')
          break
        default:
          // case where user has email cached and is
          // logging in without triggering verify email template
          finalizeLoginMethod = () =>
            window.open(`${exchangeDomain}/trade/auth?jwt=${jwtToken}`, '_self', 'noreferrer')
          break
      }

      // track login event
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_SIGNED_IN,
          properties: {
            authentication_type: 'PASSWORD',
            has_cloud_backup: magicLinkData?.wallet?.has_cloud_backup,
            is_mobile_setup: magicLinkData?.wallet?.is_mobile_setup,
            mergeable: magicLinkData?.mergeable,
            nabu_id: magicLinkData?.wallet?.nabu?.user_id,
            site_redirect: product,
            unified: false,
            upgradeable: magicLinkData?.upgradeable
          }
        })
      )

      // route user to final destination
      finalizeLoginMethod()
      // @ts-ignore
    } catch (e: { code?: number }) {
      yield put(actions.auth.exchangeLoginFailure(e?.code))
      yield put(stopSubmit(LOGIN_FORM))
      // determine action for error type
      switch (true) {
        case e?.code === ExchangeErrorCodes.MISSING_2FA:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.TWO_FA_EXCHANGE))
          break
        case e?.code === ExchangeErrorCodes.WRONG_2FA:
          yield put(
            actions.analytics.trackEvent({
              key: Analytics.LOGIN_TWO_STEP_VERIFICATION_DENIED,
              properties: {
                device_origin: platform,
                site_redirect: product,
                unified: false
              }
            })
          )
          break
        case e?.code === ExchangeErrorCodes.INVALID_CREDENTIALS:
          yield put(
            actions.analytics.trackEvent({
              key: Analytics.LOGIN_PASSWORD_DENIED,
              properties: {
                site_redirect: product,
                unified: false
              }
            })
          )
          break
        // captcha or unknown error
        default:
          yield put(actions.alerts.displayError(C.LOGIN_ERROR))
      }
    }
  }

  const checkWalletDerivationsLegitimacy = function* () {
    const accounts = yield call(coreSagas.wallet.getAccountsWithIncompleteDerivations)

    if (accounts.length > 0) {
      yield call(coreSagas.wallet.replenishDerivations, accounts)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const checkWalletDefaultAccountIdx = function* () {
    const needsUpdate = yield call(coreSagas.wallet.getHdWalletWithMissingDefaultAccountIdx)
    if (needsUpdate) {
      yield call(coreSagas.wallet.fixHdWalletWithMissingDefaultAccountIdx)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const checkWalletAccountsDefaultDerivation = function* () {
    const accounts = yield call(coreSagas.wallet.getAccountsWithMissingDefaultDerivation)
    if (accounts.length > 0) {
      yield call(coreSagas.wallet.fixAccountsWithMissingDefaultDerivation, accounts)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const payloadHealthCheck = function* () {
    const errors: string[] = yield call(coreSagas.wallet.payloadHealthCheck)
    yield all(
      errors.map(function* (error) {
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.CLIENT_ERROR,
            properties: {
              action: 'PayloadHealthCheck',
              error,
              title: 'Payload Health Check'
            } as ClientErrorProperties
          })
        )
      })
    )
  }

  const loginRoutineSaga = function* ({
    country = undefined,
    email = undefined,
    firstLogin = false,
    recovery = false,
    state = undefined
  }: LoginRoutinePayloadType) {
    try {
      const product = yield select(selectors.auth.getProduct)
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.wallet.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const createExchangeUserFlag = (yield select(
        selectors.core.walletOptions.getCreateExchangeUserOnSignupOrLogin
      )).getOrElse(false)
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      if (!isLatestVersion) {
        yield put(actions.wallet.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isAccountReset: boolean = yield select(selectors.signup.getAccountReset)
      // Finish upgrades
      yield put(actions.auth.authenticate())
      yield put(actions.signup.setFirstLogin(firstLogin))
      // root and wallet are necessary to auth into the exchange
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.unifiedCredentials.fetchMetadataUnifiedCredentials)
      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)
      // If there was no eth metadata kv store entry, we need to create one and that requires the second password.

      yield call(coreSagas.kvStore.eth.fetchMetadataEth, askSecondPasswordEnhancer)
      yield put(actions.middleware.webSocket.xlm.startStreams())
      yield call(coreSagas.kvStore.xlm.fetchMetadataXlm, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield call(coreSagas.data.xlm.fetchLedgerDetails)
      yield call(coreSagas.data.xlm.fetchData)

      yield call(authNabu)
      if (product === ProductAuthOptions.EXCHANGE && (recovery || !firstLogin)) {
        return yield put(
          actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Login)
        )
      }

      const guid = yield select(selectors.core.wallet.getGuid)
      if (firstLogin && !isAccountReset && !recovery) {
        // create nabu user
        yield call(createUser)
        yield call(api.setUserInitialAddress, country, state)
        yield call(coreSagas.settings.fetchSettings)
      }
      if (!isAccountReset && !recovery && createExchangeUserFlag) {
        if (firstLogin) {
          yield call(createExchangeUser, country)
          const exchangeAccountFailure = yield select(selectors.auth.getExchangeFailureStatus)

          if (exchangeAccountFailure) {
            // Clear cache of all previously stores exchange info
            // if exchange account creation fails so cache + login
            // doesn't get into a weird state
            yield put(actions.cache.removeExchangeLogin())
          } else {
            yield put(actions.cache.exchangeEmail(email))
            yield put(actions.cache.exchangeWalletGuid(guid))
            yield put(actions.cache.setUnifiedAccount(true))
          }
        } else {
          // We likely don't need this, don't remember why it was added
          // Leaving in case bugs arise - LB
          // yield take([
          //   actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS,
          //   actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE
          // ])
          const existingUserCountryCode = (yield select(
            selectors.modules.profile.getUserCountryCode
          )).getOrElse('US')
          yield fork(createExchangeUser, existingUserCountryCode)
        }
      }
      if (firstLogin) {
        const countryCode = country || 'US'
        const currency = getFiatCurrencyFromCountry(countryCode)

        yield put(actions.modules.settings.updateCurrency(currency, true))
        yield put(actions.core.settings.setCurrency(currency))

        if (isAccountReset) {
          if (product === ProductAuthOptions.EXCHANGE) {
            yield put(
              actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Login)
            )
            return
          }
          if (product === ProductAuthOptions.WALLET) {
            yield put(actions.router.push('/home'))
          } else {
            yield put(actions.router.push('/select-product'))
          }
        } else {
          yield put(actions.router.push('/verify-email-step'))
        }
      } else {
        yield put(actions.router.push('/home'))
      }
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.startLogoutTimer())
      yield call(startCoinWebsockets)

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
      // We are checking wallet metadata to see if mnemonic is verified
      // and then syncing that information with new Wallet Account model
      // being used for SSO
      yield fork(updateMnemonicBackup)
      // ensure xpub cache is correct
      yield fork(checkXpubCacheLegitimacy)
      // ensure derivations are correct
      yield fork(checkWalletDerivationsLegitimacy)
      // ensure default_account_idx is set
      yield fork(checkWalletDefaultAccountIdx)
      // ensure default_derivation is set on each account
      yield fork(checkWalletAccountsDefaultDerivation)
      // check payload shape
      yield fork(payloadHealthCheck)
      yield fork(checkDataErrors)
      yield put(actions.auth.loginSuccess(true))

      // Debit Card Module initialization
      yield put(actions.components.debitCard.getProducts())
      // Referral initialization
      yield put(actions.components.referral.getReferralInformation())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const login = function* (action) {
    const { code, guid, password, sharedKey } = action.payload
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const { exchangeEmail, unifiedAccount } = yield select(selectors.cache.getCache)
    const { email, emailToken } = formValues
    const accountUpgradeFlow = yield select(S.getAccountUnificationFlowType)
    const product = yield select(S.getProduct)
    const { platform, sessionIdMobile } = yield select(S.getProductAuthMetadata)
    let session
    // if user is opening from mobile webview
    if (sessionIdMobile) {
      session = sessionIdMobile
    } else if (product === ProductAuthOptions.EXCHANGE) {
      session = yield select(selectors.session.getExchangeSessionId, exchangeEmail)
    } else {
      session = yield select(selectors.session.getWalletSessionId, guid, email)
    }
    if (code) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_TWO_STEP_VERIFICATION_ENTERED,
          properties: {
            device_origin: platform,
            site_redirect: product,
            unified: unifiedAccount
          }
        })
      )
    } else {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_PASSWORD_ENTERED,
          properties: {
            device_origin: platform,
            site_redirect: product,
            unified: unifiedAccount
          }
        })
      )
    }
    yield put(startSubmit(LOGIN_FORM))
    try {
      if (!session) {
        session = yield call(api.obtainSessionToken)
        if (product === ProductAuthOptions.EXCHANGE) {
          yield put(actions.session.saveExchangeSession({ email: exchangeEmail, id: session }))
        } else {
          yield put(actions.session.saveWalletSession({ email, guid, id: session }))
        }
      }
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
      const magicLinkData: AuthMagicLink = yield select(S.getMagicLinkData)

      switch (true) {
        // case accountUpgradeFlow === AccountUnificationFlows.WALLET_MERGE:
        //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_CONFIRM))
        //   break
        case accountUpgradeFlow === AccountUnificationFlows.MOBILE_WALLET_MERGE:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
          break
        // case accountUpgradeFlow === AccountUnificationFlows.EXCHANGE_MERGE ||
        //   accountUpgradeFlow === AccountUnificationFlows.MOBILE_EXCHANGE_MERGE:
        //   // call action to merge account
        //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_SUCCESS))
        //   break
        // if account is unified, we run wallet
        // loginRoutineSaga for both. login routine
        // catches whether account is exchange or not
        case accountUpgradeFlow === AccountUnificationFlows.UNIFIED:
          yield call(loginRoutineSaga, {})

          break
        default:
          yield call(loginRoutineSaga, {})
          break
      }
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_SIGNED_IN,
          properties: {
            authentication_type: 'PASSWORD',
            device_origin: platform,
            has_cloud_backup: magicLinkData?.wallet?.has_cloud_backup,
            is_mobile_setup: magicLinkData?.wallet?.is_mobile_setup,
            mergeable: magicLinkData?.mergeable,
            nabu_id: magicLinkData?.wallet?.nabu?.user_id,
            site_redirect: product,
            unified: unifiedAccount,
            upgradeable: magicLinkData?.upgradeable
          }
        })
      )
      // Solves the problem of from submit stopping
      // before exchange login is complete for unified accounts
      // heartbeat loader would stop for a second before
      // opening exchange window
      if (product !== ProductAuthOptions.EXCHANGE) {
        yield put(stopSubmit(LOGIN_FORM))
      }
    } catch (e) {
      const error = e as LoginApiErrorType
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
              yield call(loginRoutineSaga, {})
              // }
            } catch (e) {
              // If error is that 2fa is required
              const error = e as LoginApiErrorType
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
          // remove 2fa by setting auth type to zero
          yield put(actions.auth.setAuthType(0))
          yield put(actions.form.clearFields(LOGIN_FORM, false, true, 'password', 'code'))
          if (product === ProductAuthOptions.WALLET) {
            yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
          }
          if (product === ProductAuthOptions.EXCHANGE) {
            yield put(actions.auth.exchangeLoginFailure(8))
            yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
          }
          yield put(actions.form.focus(LOGIN_FORM, 'password'))
          yield put(actions.auth.loginFailure(errorString))
          yield put(
            actions.analytics.trackEvent({
              key: Analytics.LOGIN_PASSWORD_DENIED,
              properties: {
                site_redirect: product,
                unified: unifiedAccount
              }
            })
          )
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
        // Account locked due to too many failed 2fa attempts
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
          yield put(
            actions.analytics.trackEvent({
              key: Analytics.LOGIN_TWO_STEP_VERIFICATION_DENIED,
              properties: {
                device_origin: platform,
                site_redirect: product,
                unified: unifiedAccount
              }
            })
          )
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

  const resendSmsLoginCode = function* (action) {
    try {
      const { email, guid } = action.payload
      const product = yield select(S.getProduct)
      let sessionToken
      if (product === ProductAuthOptions.EXCHANGE) {
        sessionToken = yield select(selectors.session.getExchangeSessionId, email)
      } else {
        sessionToken = yield select(selectors.session.getWalletSessionId, guid, email)
      }
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
      // open coin ws needed for coin streams and channel key for mobile login
      yield put(actions.ws.startSocket())

      // get product auth data from querystring
      const queryParams = new URLSearchParams(yield select(selectors.router.getSearch))
      // get guid when wallet is launched from a logged in exchange account
      const guidFromQueryParams = queryParams.get('guid') as string
      // get email when wallet is launched from a logged in exchange account
      const emailFromQueryParams = decodeURIComponent(queryParams.get('email') as string)
      // get device platform param or default to web
      const platform = (queryParams.get('platform') || PlatformTypes.WEB) as PlatformTypes
      // get product param or default to wallet
      const product = (queryParams.get('product')?.toUpperCase() ||
        ProductAuthOptions.WALLET) as ProductAuthOptions
      const userType = (queryParams.get('userType')?.toUpperCase() || undefined) as AuthUserType
      const redirect = queryParams.get('redirect') as string
      // keeps session id consistent if logging in from mobile exchange app
      const sessionIdMobile = queryParams.get('sessionId') as string
      // store product auth data defaulting to product=wallet and platform=web
      yield put(
        actions.auth.setProductAuthMetadata({
          platform,
          product,
          redirect,
          userType
        })
      )
      // select required data to initialize auth below
      const pathname = yield select(selectors.router.getPathname)
      const urlPathParams = pathname.split('/')
      const walletGuidOrMagicLinkFromUrl = urlPathParams[2]
      const isUnified = yield select(selectors.cache.getUnifiedAccountStatus)
      const storedGuid = yield select(selectors.cache.getStoredGuid)
      const lastGuid = yield select(selectors.cache.getLastGuid)
      const exchangeEmail = yield select(selectors.cache.getExchangeEmail)
      const exchangeWalletGuid = yield select(selectors.cache.getExchangeWalletGuid)
      const DEFAULT_WALLET_LOGIN = '/login?product=wallet'
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
        case userType === AuthUserType.INSTITUTIONAL:
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.INSTITUTIONAL_PORTAL))
          break
        // user is opening wallet from inside exchange settings
        // guid and email are on url
        case guidFromQueryParams !== null && emailFromQueryParams !== null:
          yield put(actions.router.push(DEFAULT_WALLET_LOGIN))
          yield put(actions.cache.emailStored(emailFromQueryParams))
          yield put(actions.cache.guidStored(guidFromQueryParams))
          yield put(actions.form.change(LOGIN_FORM, 'guid', guidFromQueryParams))
          yield put(actions.form.change(LOGIN_FORM, 'email', emailFromQueryParams))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
          break
        // no guid on path, use cached/stored guid if exists
        case (storedGuid || lastGuid) &&
          !walletGuidOrMagicLinkFromUrl &&
          product === ProductAuthOptions.WALLET:
          // change product param in url to make it clear to user
          yield put(actions.router.push(DEFAULT_WALLET_LOGIN))
          // select required data
          const email = yield select(selectors.cache.getEmail)
          // logic to be compatible with lastGuid in cache make sure that email matches
          // guid being used for login eventually can be cleared after some time
          yield put(actions.form.change(LOGIN_FORM, 'guid', lastGuid || storedGuid))
          if (exchangeWalletGuid) {
            yield put(actions.form.change(LOGIN_FORM, 'exchangeUnifiedGuid', exchangeWalletGuid))
          }
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
            yield put(actions.router.push(DEFAULT_WALLET_LOGIN))
            yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
          }
          if (product === ProductAuthOptions.EXCHANGE) {
            if (exchangeEmail) {
              yield put(actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail))
              if (isUnified && exchangeWalletGuid) {
                yield put(actions.form.change(LOGIN_FORM, 'guid', exchangeWalletGuid))
                yield put(
                  actions.form.change(LOGIN_FORM, 'exchangeUnifiedGuid', exchangeWalletGuid)
                )
              }

              yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
            } else {
              yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
            }
          }
          break
        // guid is on the url e.g. login/{guid}
        case isGuid(walletGuidOrMagicLinkFromUrl):
          yield put(actions.router.push(DEFAULT_WALLET_LOGIN))
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
          yield call(
            determineAuthenticationFlow,
            queryParams.has('skipSessionCheck'),
            sessionIdMobile
          )
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeLogin', e))
    }
  }

  // this is the function we run when submitting the login form
  const continueLoginProcess = function* () {
    const {
      code,
      email,
      exchangeEmail,
      exchangePassword,
      exchangeTwoFA,
      exchangeUnifiedGuid,
      guid,
      guidOrEmail,
      password,
      step
    } = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const unificationFlowType = yield select(S.getAccountUnificationFlowType)
    const unified = yield select(selectors.cache.getUnifiedAccountStatus)
    const authType = yield select(S.getAuthType)
    const { product, userType } = yield select(S.getProductAuthMetadata)
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
          yield put(actions.auth.triggerWalletMagicLink({ email: exchangeEmail }))
        } else {
          // trigger email from wallet form
          yield put(actions.form.change(LOGIN_FORM, 'email', email || guidOrEmail))
          yield put(actions.auth.triggerWalletMagicLink({ email: email || guidOrEmail }))
        }
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.LOGIN_IDENTIFIER_ENTERED,
            properties: {
              identifier_type: isGuid(guidOrEmail) ? 'WALLET_ID' : 'EMAIL',
              site_redirect: product,
              unified
            }
          })
        )
      } else if (
        step === LoginSteps.ENTER_PASSWORD_WALLET ||
        (step === LoginSteps.TWO_FA_WALLET && product === ProductAuthOptions.WALLET)
      ) {
        yield put(
          actions.auth.login({ code: auth, guid, mobileLogin: null, password, sharedKey: null })
        )
      } else if (
        (unificationFlowType === AccountUnificationFlows.UNIFIED || unified) &&
        userType !== AuthUserType.INSTITUTIONAL
      ) {
        // exchange login but it is a unified account
        // so it's using wallet login under the hood
        // create a new saga that logs into the wallet and retrieves
        // the jwt token underneath
        yield put(
          actions.auth.login({
            code: auth,
            guid: exchangeUnifiedGuid,
            mobileLogin: null,
            password: exchangePassword,
            sharedKey: null
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
    const { email } = action.payload
    const { product, redirect } = yield select(selectors.auth.getProductAuthMetadata)

    try {
      let sessionToken
      yield put(startSubmit(LOGIN_FORM))
      const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
      const { step } = formValues

      if (step === LoginSteps.CHECK_EMAIL && product === ProductAuthOptions.EXCHANGE) {
        sessionToken = yield select(selectors.session.getSession, null, email)
        if (!sessionToken) {
          sessionToken = yield call(api.obtainSessionToken)
          yield put(actions.session.saveExchangeSession({ email, id: sessionToken }))
        }
      } else {
        sessionToken = yield call(api.obtainSessionToken)
        if (product === ProductAuthOptions.EXCHANGE) {
          yield put(actions.session.saveExchangeSession({ email, id: sessionToken }))
        } else {
          yield put(actions.session.saveWalletSession({ email, id: sessionToken }))
        }
      }
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.LOGIN)
      yield call(api.triggerWalletMagicLink, sessionToken, email, captchaToken, product, redirect)
      if (step === LoginSteps.CHECK_EMAIL) {
        yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
      } else {
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.CHECK_EMAIL))
      }
      yield put(stopSubmit(LOGIN_FORM))
      // poll for session from auth payload
      yield call(pollForSessionFromAuthPayload, api, sessionToken)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'triggerWalletMagicLink', e))
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
      yield put(stopSubmit(LOGIN_FORM))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_IDENTIFIER_FAILED,
          properties: {
            error_code: e.code,
            error_message: e.description,
            site_redirect: product
          }
        })
      )
    }
  }

  const authorizeVerifyDevice = function* (action) {
    const confirmDevice = action.payload
    const magicLinkDataEncoded = yield select(selectors.auth.getMagicLinkDataEncoded)
    const { exchange, product, session_id, wallet } = yield select(selectors.auth.getMagicLinkData)
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
        if (product === ProductAuthOptions.EXCHANGE) {
          yield put(actions.cache.exchangeEmail(exchange?.email))
        }
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.LOGIN_REQUEST_APPROVED,
            properties: {
              method: 'MAGIC_LINK',
              request_platform: product
            }
          })
        )
      }
      // @ts-ignore
    } catch (e: { confirmation_required: boolean; status?: number }) {
      if (e && e.status === 401 && e.confirmation_required) {
        yield put(actions.auth.authorizeVerifyDeviceSuccess(e))
      } else if (e && e.status === 409 && e.request_denied) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_REQUEST_DENIED,
          properties: {
            error: 'REJECTED',
            method: 'MAGIC_LINK',
            request_platform: product
          }
        })
      } else if (e && e.status === 400 && e.link_expired) {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e))
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.LOGIN_REQUEST_DENIED,
            properties: {
              error: 'EXPIRED',
              method: 'MAGIC_LINK',
              request_platform: product
            }
          })
        )
      } else {
        yield put(actions.auth.authorizeVerifyDeviceFailure(e.error))
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.LOGIN_REQUEST_DENIED,
            properties: {
              error: 'UNKNOWN',
              method: 'MAGIC_LINK',
              request_platform: product
            }
          })
        )
      }
    }
  }
  const sendLoginMessageToExchangeMobileApp = function* () {
    const { platform } = yield select(selectors.signup.getProductSignupMetadata)
    sendMessageToMobile(platform, {
      data: {
        action: 'login'
      }
    })
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
    resendSmsLoginCode,
    sendLoginMessageToExchangeMobileApp,
    triggerWalletMagicLink
  }
}
