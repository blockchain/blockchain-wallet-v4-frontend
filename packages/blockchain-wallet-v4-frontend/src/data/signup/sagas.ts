import { call, put, select } from 'redux-saga/effects'

import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import authSagas from 'data/auth/sagas'
import profileSagas from 'data/modules/profile/sagas'
import {
  Analytics,
  AuthMagicLink,
  ExchangeAuthOriginType,
  ProductAuthOptions,
  TwoFASetupSteps,
  UpgradeSteps
} from 'data/types'
import * as C from 'services/alerts'
import { askSecondPasswordEnhancer } from 'services/sagas'

export default ({ api, coreSagas, networks }) => {
  const logLocation = 'auth/sagas'
  const { generateRetailToken, setSession } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const { loginRoutineSaga } = authSagas({
    api,
    coreSagas,
    networks
  })

  const LOGIN_FORM = 'login'

  const createWalletForExchangeAccountUpgrade = function* (action) {
    // start some sort of form submit so state is loading
    try {
      const { captchaToken, password } = action.payload
      const magicLinkData = yield select(selectors.auth.getMagicLinkData)
      const { email } = magicLinkData.exchange
      const language = yield select(selectors.preferences.getLanguage)
      const exchangeSessionToken = yield select(selectors.auth.getExchangeSessionToken)
      yield call(coreSagas.wallet.createWalletSaga, { captchaToken, email, language, password })
      const retailToken = yield call(generateRetailToken)
      const { mercuryToken, nabuToken, userCredentialsId, userId } = yield call(
        api.upgradeExchangeUserAccount,
        exchangeSessionToken,
        retailToken
      )
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      yield put(
        actions.core.kvStore.userCredentials.setUnifiedAccountCredentials(
          userId,
          nabuToken,
          userCredentialsId,
          mercuryToken
        )
      )
      yield put(actions.form.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE))
    } catch (e) {
      // Handle Errors
    }
  }

  const register = function* (action) {
    const { country, email, initCaptcha, state } = action.payload
    const isAccountReset: boolean = yield select(selectors.signup.getAccountReset)
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    // Want this behind a feature flag to monitor
    // if this thing could be abused or not
    const refreshToken = (yield select(
      selectors.core.walletOptions.getRefreshCaptchaOnSignupError
    )).getOrElse(false)
    try {
      yield put(actions.signup.registerLoading())
      yield put(actions.auth.loginLoading())
      yield put(actions.signup.setRegisterEmail(email))
      yield call(coreSagas.wallet.createWalletSaga, action.payload)
      // We don't want to show the account success message if
      // user is resetting their account
      if (!isAccountReset) {
        yield put(actions.alerts.displaySuccess(C.REGISTER_SUCCESS))
      }
      // if (formValues?.step === LoginSteps.UPGRADE_PASSWORD) {
      //   yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.UPGRADE_SUCCESS))
      // } else {
      yield call(loginRoutineSaga, {
        country,
        email,
        firstLogin: true,
        state
      })
      yield put(actions.signup.registerSuccess(undefined))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.ONBOARDING_WALLET_SIGNED_UP,
          properties: {
            country,
            country_state: state
          }
        })
      )
    } catch (e) {
      yield put(actions.signup.registerFailure(undefined))
      yield put(actions.auth.loginFailure(e))
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
      const { captchaToken, email, language, mnemonic, password } = action.payload
      const kvCredentials = (yield select(selectors.signup.getMetadataRestore)).getOrElse({})

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
      // set new lifetime tokens for nabu and exchange for user in metadata
      yield put(
        actions.core.kvStore.userCredentials.setUnifiedAccountCredentials(
          userId,
          lifetimeToken,
          exchangeUserId,
          exchangeLifetimeToken
        )
      )
      // if user is resetting their account and
      // want to go to the Exchange
      if (magicLinkData.product === ProductAuthOptions.EXCHANGE) {
        yield put(actions.modules.profile.getExchangeLoginToken(ExchangeAuthOriginType.Login))
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
      yield put(actions.modals.showModal('RESET_ACCOUNT_FAILED', { origin: 'ResetAccount' }))
    }
  }

  const initializeSignUp = function* () {
    const queryParams = new URLSearchParams(yield select(selectors.router.getSearch))
    const referrerUsername = queryParams.get('referrerUsername') as string
    const tuneTid = queryParams.get('tuneTid') as string
    yield put(
      actions.signup.setExchangeUrlData({
        referrerUsername,
        tuneTid
      })
    )
  }

  return {
    createWalletForExchangeAccountUpgrade,
    initializeSignUp,
    register,
    resetAccount,
    restore,
    restoreFromMetadata
  }
}
