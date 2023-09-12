import base64url from 'base64url'
import { startSubmit, stopSubmit } from 'redux-form'
import { call, delay, put, select } from 'redux-saga/effects'

import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import authSagas from 'data/auth/sagas'
import miscSagas from 'data/misc/sagas'
import profileSagas from 'data/modules/profile/sagas'
import {
  AccountRecoveryApprovalStatusType,
  AccountRecoveryMagicLinkData,
  Analytics,
  AuthMagicLink,
  CaptchaActionName,
  ExchangeAuthOriginType,
  ModalName,
  PlatformTypes,
  ProductAuthOptions,
  RecoverSteps,
  ResetFormSteps,
  SignupRedirectTypes
} from 'data/types'
import * as C from 'services/alerts'
import { askSecondPasswordEnhancer } from 'services/sagas'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'auth/sagas'
  const SIGNUP_FORM = 'register'
  const { createExchangeUser, createUser, generateRetailToken, setSession } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const { authNabu, loginRoutineSaga } = authSagas({
    api,
    coreSagas,
    networks
  })

  const REFERRAL_ERROR_MESSAGE = 'Invalid Referral Code'
  const RECOVER_FORM = 'recover'

  const { generateCaptchaToken } = miscSagas()

  const exchangeMobileAppSignup = function* ({
    country = undefined,
    email = undefined,
    state = undefined
  }) {
    try {
      yield call(coreSagas.settings.fetchSettings)
      yield put(actions.auth.authenticate())
      // root and wallet are necessary to auth into the exchange
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.unifiedCredentials.fetchMetadataUnifiedCredentials)
      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)

      yield call(authNabu)
      yield call(createUser)
      // store initial address in case of US state we add prefix
      yield call(api.setUserInitialAddress, country, state)
      yield call(coreSagas.settings.fetchSettings)
      yield call(createExchangeUser, country)
      yield put(actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Signup))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'exchangeMobileAppSignup', e))
    }
  }

  const checkReferralCode = function* (referral) {
    try {
      yield call(api.checkIsValidReferralCode, referral)
      yield put(actions.signup.setIsValidReferralCode(true))
    } catch (e) {
      yield put(actions.signup.setIsValidReferralCode(false))
      throw new Error(REFERRAL_ERROR_MESSAGE)
    }
  }

  const register = function* (action) {
    const { country, email, language, password, referral, sessionToken, state } = action.payload

    const isAccountReset: boolean = yield select(selectors.signup.getAccountReset)
    const accountRecoveryV2: boolean = selectors.core.walletOptions
      .getAccountRecoveryV2(yield select())
      .getOrElse(false) as boolean

    const { platform, product } = yield select(selectors.signup.getProductSignupMetadata)
    const isExchangeMobileSignup =
      product === ProductAuthOptions.EXCHANGE &&
      (platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS)
    try {
      const isReferralEntered = referral && referral.length > 0
      if (isReferralEntered) {
        yield call(checkReferralCode, referral)
      }

      yield put(actions.signup.registerLoading())
      yield put(actions.auth.loginLoading())
      yield put(actions.signup.setRegisterEmail(email))
      yield put(actions.signup.setSignupCountry(country))
      yield put(actions.signup.setSignupCountryState(state))
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.SIGNUP)
      if (isAccountReset && accountRecoveryV2) {
        yield call(coreSagas.wallet.createResetWalletSaga, {
          captchaToken,
          email,
          language,
          password,
          sessionToken
        })
      } else {
        yield call(coreSagas.wallet.createWalletSaga, {
          captchaToken,
          email,
          forceVerifyEmail: isAccountReset,
          language,
          password
        })
      }
      // We don't want to show the account success message if user is resetting their account
      if (!isAccountReset && !isExchangeMobileSignup) {
        yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      }
      if (isExchangeMobileSignup) {
        yield call(exchangeMobileAppSignup, {
          country,
          email,
          state
        })
      } else {
        yield call(loginRoutineSaga, {
          country,
          email,
          firstLogin: true,
          state
        })
        yield put(actions.signup.registerSuccess(undefined))
      }
      if (!isAccountReset) {
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.ONBOARDING_WALLET_SIGNED_UP,
            properties: {
              country,
              country_state: state,
              device_origin: platform
            }
          })
        )
      }
      if (product === ProductAuthOptions.EXCHANGE) {
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.ONBOARDING_EXCHANGE_SIGNED_UP,
            properties: {
              country,
              country_state: `${country}-${state}`,
              device_origin: platform,
              unified: true
            }
          })
        )
      }
      if (isReferralEntered) {
        yield call(api.createReferral, referral)
      }
    } catch (e) {
      if (e.message !== REFERRAL_ERROR_MESSAGE) {
        yield put(actions.signup.registerFailure(undefined))
        yield put(actions.auth.loginFailure(e))
        yield put(actions.logs.logErrorMessage(logLocation, 'register', e))
        yield put(actions.alerts.displayError(C.REGISTER_ERROR))
      }
    }
  }

  const restoreFromMetadata = function* (action) {
    const mnemonic = action.payload
    try {
      yield put(actions.signup.restoreFromMetadataLoading())
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
      const { created, token: lifetimeToken, userId } = yield call(api.createOrGetUser, token)
      // if the recovered user never had a nabu account, we're creating a new user
      // so created will return true. No need to reset their kyc
      if (!created) {
        try {
          // call reset kyc
          yield call(api.resetUserKyc, userId, lifetimeToken, token)
          yield put(actions.signup.setKycResetStatus(true))
          yield put(actions.signup.restoreFromMetadataSuccess(metadataInfo))
          // @ts-ignore
        } catch (e: { status?: number }) {
          // if it fails with user already being reset, should be allowed
          // to continue with flow
          if (e && e.status === 409) {
            yield put(actions.signup.restoreFromMetadataSuccess(metadataInfo))
            yield put(actions.signup.setKycResetStatus(true))
          } else {
            yield put(actions.alerts.displayError(C.KYC_RESET_ERROR))
            yield put(actions.signup.restoreFromMetadataFailure(errorHandler(e)))
            yield put(actions.signup.setKycResetStatus(false))
          }
        }
      } else {
        yield put(actions.signup.restoreFromMetadataSuccess(metadataInfo))
      }
    } catch (e) {
      yield put(actions.signup.restoreFromMetadataFailure(errorHandler(e)))
      yield put(actions.logs.logErrorMessage(logLocation, 'restoreFromMetadata', e))
    }
  }

  const restore = function* (action) {
    try {
      const { email, language, mnemonic, password } = action.payload
      const kvCredentials = (yield select(selectors.signup.getMetadataRestore)).getOrElse({})
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.RECOVER)

      yield put(actions.signup.restoreLoading())
      yield put(actions.signup.setRegisterEmail(email))
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
      yield put(actions.signup.restoreSuccess(undefined))
    } catch (e) {
      yield put(actions.signup.restoreFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'restore', e))
      yield put(actions.alerts.displayError(C.RESTORE_ERROR))
    }
  }

  const resetAccountV2 = function* (action) {
    // if user is resetting their custodial account
    // create a new wallet and assign an existing custodial account to that wallet
    try {
      const { email, language, password } = action.payload
      // get recovery token and nabu ID
      const sessionToken = yield select(selectors.session.getRecoverSessionId, email)
      yield put(actions.signup.setResetAccount(true))
      // create a new wallet
      yield call(register, actions.signup.register({ email, language, password, sessionToken }))
      const guid = yield select(selectors.core.wallet.getGuid)
      const data = sessionStorage.getItem('accountRecovery')

      const accountRecoveryData = data && JSON.parse(data)

      const { mercuryLifetimeToken, token, userCredentialsId, userId } = accountRecoveryData

      // set new lifetime tokens for nabu and exchange for user in new unified metadata entry
      // also write nabu credentials to legacy userCredentials for old app versions
      // TODO: in future, consider just writing to unifiedCredentials entry
      yield put(actions.core.kvStore.userCredentials.setUserCredentials(userId, token))
      yield put(
        actions.core.kvStore.unifiedCredentials.setUnifiedCredentials({
          exchange_lifetime_token: mercuryLifetimeToken,
          exchange_user_id: userCredentialsId,
          nabu_lifetime_token: token,
          nabu_user_id: userId
        })
      )

      sessionStorage.removeItem('accountRecovery')

      // fetch user in new wallet
      yield call(setSession, userId, token, email, guid)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.RECOVERY_PASSWORD_RESET,
          properties: {
            account_type: 'CUSTODIAL',
            site_redirect: 'WALLET'
          }
        })
      )
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.ACCOUNT_RECOVERY_PROCESS_COMPLETED,
          properties: {}
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resetAccount', e))
      yield put(
        actions.modals.showModal(ModalName.RESET_ACCOUNT_FAILED, { origin: 'ResetAccount' })
      )
      sessionStorage.removeItem('accountRecovery')
    }
  }

  const resetAccount = function* (action) {
    // if user is resetting their custodial account
    // create a new wallet and assign an existing custodial account to that wallet
    try {
      const { email, language, password } = action.payload
      // get recovery token and nabu ID
      const magicLinkData: AuthMagicLink = yield select(selectors.auth.getMagicLinkData)
      const recoveryToken = magicLinkData.wallet?.nabu?.recovery_token
      const userId = magicLinkData.wallet?.nabu?.user_id
      yield put(actions.signup.setResetAccount(true))
      // create a new wallet
      yield call(register, actions.signup.register({ email, language, password }))
      const guid = yield select(selectors.core.wallet.getGuid)
      // generate a retail token for new wallet
      const retailToken = yield call(generateRetailToken)
      // call the reset nabu user endpoint, receive new lifetime token for nabu user
      const {
        mercuryLifetimeToken: exchangeLifetimeToken,
        token: lifetimeToken,
        userCredentialsId: exchangeUserId
      } = yield call(api.resetUserAccount, userId, recoveryToken, retailToken)
      // set new lifetime tokens for nabu and exchange for user in new unified metadata entry
      // also write nabu credentials to legacy userCredentials for old app versions
      // TODO: in future, consider just writing to unifiedCredentials entry
      yield put(actions.core.kvStore.userCredentials.setUserCredentials(userId, lifetimeToken))
      yield put(
        actions.core.kvStore.unifiedCredentials.setUnifiedCredentials({
          exchange_lifetime_token: exchangeLifetimeToken,
          exchange_user_id: exchangeUserId,
          nabu_lifetime_token: lifetimeToken,
          nabu_user_id: userId
        })
      )

      // if user is resetting their account and
      // want to go to the Exchange
      if (magicLinkData.product === ProductAuthOptions.EXCHANGE) {
        yield put(
          actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Login)
        )
        return
      }
      // fetch user in new wallet
      yield call(setSession, userId, lifetimeToken, email, guid)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.RECOVERY_PASSWORD_RESET,
          properties: {
            account_type: 'CUSTODIAL',
            site_redirect: 'WALLET'
          }
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resetAccount', e))
      yield put(
        actions.modals.showModal(ModalName.RESET_ACCOUNT_FAILED, { origin: 'ResetAccount' })
      )
    }
  }

  const initializeSignUp = function* () {
    yield put(actions.modules.profile.clearSession())
    yield put(actions.modules.profile.clearProfileState())
    const queryParams = new URLSearchParams(yield select(selectors.router.getSearch))
    const referrerUsername = queryParams.get('referrerUsername') as string
    const tuneTid = queryParams.get('tuneTid') as string
    const product = queryParams.get('product') as ProductAuthOptions
    const platform = queryParams.get('platform') as PlatformTypes
    const signupRedirect = queryParams.get('redirect') as SignupRedirectTypes
    yield put(
      actions.signup.setProductSignupMetadata({
        platform,
        product,
        referrerUsername,
        signupRedirect,
        tuneTid
      })
    )
    yield put(
      actions.analytics.trackEvent({
        key: Analytics.SIGNUP_VIEWED,
        properties: {}
      })
    )
  }
  const pollForResetApproval = function* (sessionToken, n = 50) {
    if (n === 0) {
      yield put(actions.form.change(RECOVER_FORM, 'step', RecoverSteps.FORGOT_PASSWORD_EMAIL))
      yield put(actions.alerts.displayInfo(C.VERIFY_DEVICE_EXPIRY, undefined, true))

      return false
    }
    try {
      yield delay(2000)
      const response = yield call(api.pollForResetApprovalStatus, sessionToken)
      if (response?.status === AccountRecoveryApprovalStatusType.APPROVED) {
        yield put(actions.signup.setAccountRecoveryMagicLinkData(response))
        yield put(actions.form.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_OPTIONS))
        return true
      }
      if (response?.status === AccountRecoveryApprovalStatusType.INVALID) {
        yield put(actions.form.change(RECOVER_FORM, 'step', RecoverSteps.FORGOT_PASSWORD_EMAIL))
        yield put(actions.alerts.displayError(C.VERIFY_DEVICE_FAILED, undefined, true))
        return false
      }
    } catch (error) {
      return false
    }
    return yield call(pollForResetApproval, sessionToken, n - 1)
  }

  const triggerRecoverEmail = function* (action) {
    const email = action.payload
    try {
      yield put(startSubmit(RECOVER_FORM))
      const captchaToken = yield call(generateCaptchaToken, CaptchaActionName.RECOVER)

      const sessionToken = yield call(api.obtainSessionToken)
      yield put(actions.session.saveRecoverSession({ email, id: sessionToken }))

      yield call(api.triggerResetAccountEmail, captchaToken, email, sessionToken)
      yield put(stopSubmit(RECOVER_FORM))
      yield call(pollForResetApproval, sessionToken)
    } catch {
      yield put(stopSubmit(RECOVER_FORM))
    }
  }

  const approveAccountReset = function* () {
    try {
      yield put(actions.signup.accountRecoveryVerifyLoading())
      const pathname = yield select(selectors.router.getPathname)
      const urlPathParams = pathname.split('/')
      const accountRecoveryDataEncoded = urlPathParams[2] || ''
      yield put(actions.signup.setAccountRecoveryMagicLinkDataEncoded(accountRecoveryDataEncoded))
      const accountRecoveryData = JSON.parse(
        base64url.decode(accountRecoveryDataEncoded)
      ) as AccountRecoveryMagicLinkData
      const { email, recovery_token: token, userId } = accountRecoveryData
      const sessionToken = yield select(selectors.session.getRecoverSessionId, email)
      yield call(api.approveAccountReset, email, sessionToken, token, userId)
      yield put(actions.signup.accountRecoveryVerifySuccess(true))
    } catch (e) {
      yield put(actions.signup.accountRecoveryVerifyFailure(e))
    }
  }

  const triggerSmsVerificationRecovery = function* () {
    try {
      const recoveryLinkData: AccountRecoveryMagicLinkData = yield select(
        selectors.signup.getAccountRecoveryMagicLinkData
      )
      const { email, walletGuid } = recoveryLinkData
      const sessionToken = yield select(selectors.session.getRecoverSessionId, email)
      yield call(api.sendTwoFAChallenge, walletGuid, sessionToken)
      yield put(actions.form.change(RECOVER_FORM, 'step', RecoverSteps.TWO_FA_CONFIRMATION))
    } catch (e) {
      yield put(actions.alerts.displayError(C.SMS_RESEND_ERROR))
    }
  }

  const verifyTwoFaForRecovery = function* (action) {
    try {
      const { code, email } = action.payload
      const { success, verified } = yield call(api.validate2faResponse, email, code)
      if (success && verified) {
        yield put(actions.form.change(RECOVER_FORM, 'step', ResetFormSteps.NEW_PASSWORD))
        yield put(actions.alerts.displaySuccess(C.TWOFA_VERIFIED))
        yield put(actions.signup.verifyTwoFaForRecoverySuccess(true))
        yield put(
          actions.analytics.trackEvent({
            key: Analytics.ACCOUNT_RECOVERY_2FA_CONFIRMED,
            properties: {}
          })
        )
      }
      if (!verified) {
        yield put(actions.signup.verifyTwoFaForRecoveryFailure(true))
      }
    } catch (e) {
      yield put(actions.signup.verifyTwoFaForRecoveryFailure(e))
    }
  }

  return {
    approveAccountReset,
    initializeSignUp,
    pollForResetApproval,
    register,
    resetAccount,
    resetAccountV2,
    restore,
    restoreFromMetadata,
    triggerRecoverEmail,
    triggerSmsVerificationRecovery,
    verifyTwoFaForRecovery
  }
}
