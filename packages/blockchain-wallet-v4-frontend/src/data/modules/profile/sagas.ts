import sha256 from 'crypto-js/sha256'
import { differenceInMilliseconds, subSeconds } from 'date-fns'
import { compose, equals, prop, sortBy, tail } from 'ramda'
import { stopSubmit } from 'redux-form'
import { call, cancel, delay, fork, put, race, select, spawn, take } from 'redux-saga/effects'

import { Remote } from '@core'
import { ExtractSuccess, WalletOptionsType } from '@core/types'
import { actions, actionTypes, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { sendMessageToMobile } from 'data/auth/sagas.mobile'
import { Analytics, AuthMagicLink, ModalName, PlatformTypes, ProductAuthOptions } from 'data/types'
import { promptForSecondPassword } from 'services/sagas'

import * as A from './actions'
import * as AT from './actionTypes'
import { KYC_STATES, USER_ACTIVATION_STATES } from './model'
import * as S from './selectors'
import { ExchangeAuthOriginType, UserDataType } from './types'

export const logLocation = 'modules/profile/sagas'
export const userRequiresRestoreError = 'User restored'
export const authRetryDelay = 5000
export const renewUserDelay = 30000

let renewSessionTask = null
let renewUserTask = null

export default ({ api, coreSagas, networks }) => {
  const renewApiSockets = function* () {
    yield put(actions.middleware.webSocket.rates.stopSocket())
    yield put(actions.middleware.webSocket.rates.startSocket())
  }

  const waitForUserId = function* () {
    const userCredentials = yield select(
      selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
    )

    if (Remote.Success.is(userCredentials)) {
      const { nabuUserId } = userCredentials.getOrElse({ nabuUserId: null })
      return nabuUserId
    }
    yield race({
      failure: take([
        actionTypes.core.kvStore.userCredentials.FETCH_METADATA_USER_CREDENTIALS_FAILURE,
        actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE
      ]),
      success: take([
        actionTypes.core.kvStore.userCredentials.FETCH_METADATA_USER_CREDENTIALS_SUCCESS,
        actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS
      ])
    })
    const { nabuUserId } = (yield select(
      selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
    )).getOrElse({})
    return nabuUserId
  }

  const renewUser = function* (renewIn = 0) {
    try {
      yield delay(renewIn)
      const user = yield call(api.getUser)
      yield put(A.fetchUserDataSuccess(user))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'renewUser', e))
    } finally {
      yield spawn(renewUser, renewUserDelay)
    }
  }

  const waitForUserData = function* () {
    const userId = yield call(waitForUserId)
    const userData = yield select(selectors.modules.profile.getUserData)
    const apiToken = yield select(selectors.modules.profile.getApiToken)
    // If no user id in kvstore return
    if (!userId) return
    // If success or failure already return
    if (Remote.Success.is(userData)) return
    if (Remote.Failure.is(userData)) return
    // If api key failure return
    if (Remote.Failure.is(apiToken)) return
    // Wait for api (nabu sign in) success or failure
    yield race({
      failure: take(actionTypes.modules.profile.SET_API_TOKEN_SUCCESS),
      success: take(actionTypes.modules.profile.SET_API_TOKEN_FAILURE)
    })
    // Wait for success or failure
    return yield race({
      failure: take(actionTypes.modules.profile.FETCH_USER_DATA_FAILURE),
      success: take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
    })
  }

  const isTier2 = function* () {
    yield call(waitForUserData)
    const userDataR = selectors.modules.profile.getUserData(yield select())
    const userData = userDataR.getOrElse({
      tiers: { current: 0 }
    } as UserDataType)
    return userData.tiers && userData.tiers.current >= 2
  }

  const getCampaignData = function* (campaign) {
    if (campaign.name === 'sunriver') {
      const xlmAccount = (yield select(selectors.core.kvStore.xlm.getDefaultAccountId)).getOrFail()
      return {
        'x-campaign-address': xlmAccount,
        'x-campaign-code': campaign.code,
        'x-campaign-email': campaign.email
      }
    }
    if (campaign.name === 'BLOCKSTACK') {
      const password = yield call(promptForSecondPassword, ['BLOCKSTACK'])
      yield put(actions.core.data.stx.generateAddress(password))
      const { payload } = yield take(actionTypes.core.data.stx.SET_ADDRESS)
      const { address } = payload
      return {
        'x-campaign-address': address
      }
    }

    return null
  }

  const fetchTiers = function* () {
    try {
      yield put(A.fetchTiersLoading())
      const tiersData = yield call(api.fetchTiers)
      yield put(
        A.fetchTiersSuccess(
          compose(
            tail,
            // @ts-ignore
            sortBy(prop('index'))
            // @ts-ignore
          )(tiersData.tiers)
        )
      )
    } catch (e) {
      yield put(A.fetchTiersFailure(e))
    }
  }

  const fetchUser = function* () {
    try {
      const user = yield call(api.getUser)
      yield put(A.fetchUserDataSuccess(user))
      yield call(fetchTiers)
      if (!renewUserTask && user.kycState === KYC_STATES.PENDING)
        renewUserTask = yield spawn(renewUser, renewUserDelay)

      return user
    } catch (e) {
      if (prop('description', e) === userRequiresRestoreError) throw e
      yield put(A.fetchUserDataFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'fetchUser', e))
    }
  }

  const generateRetailToken = function* () {
    const guid = yield select(selectors.core.wallet.getGuid)
    const sharedKey = yield select(selectors.core.wallet.getSharedKey)
    const { token } = yield call(api.generateRetailToken, guid, sharedKey)
    return token
  }

  const setSession = function* (nabuUserId, nabuLifetimeToken, email, guid) {
    try {
      const { expiresAt, token: apiToken } = yield call(
        api.generateSession,
        nabuUserId,
        nabuLifetimeToken,
        email,
        guid
      )
      yield put(A.setApiTokenSuccess(apiToken))
      yield call(fetchUser)
      yield call(renewApiSockets)
      const expiresIn = Math.abs(
        differenceInMilliseconds(subSeconds(new Date(expiresAt), 5), new Date())
      )
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      yield spawn(renewSession, nabuUserId, nabuLifetimeToken, email, guid, expiresIn)
    } catch (e) {
      if (prop('status', e) === 409) {
        throw new Error(e.description)
      }
      throw e
    }
  }

  const renewSession = function* (nabuUserId, nabuLifetimeToken, email, guid, renewIn = 0) {
    try {
      yield delay(renewIn)
      yield call(setSession, nabuUserId, nabuLifetimeToken, email, guid)
    } catch (e) {
      yield put(A.setApiTokenFailure(e))
      if (e.message && e.message.includes('User linked to another wallet')) {
        return yield put(
          actions.modals.showModal(
            ModalName.NABU_USER_CONFLICT_REDIRECT,
            { origin: 'NabuUserAuth' },
            { errorMessage: e.message }
          )
        )
      }
      yield spawn(renewSession, nabuUserId, nabuLifetimeToken, email, guid, authRetryDelay)
    }
  }

  const recoverUser = function* () {
    const retailToken = yield call(generateRetailToken)
    const credentials = (yield select(
      selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
    )).getOrFail('Failed to find user credentials')
    const { nabuLifetimeToken, nabuUserId } = credentials
    yield call(api.recoverUser, nabuUserId, nabuLifetimeToken, retailToken)
    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)
    yield call(setSession, nabuUserId, nabuLifetimeToken, email, guid)
  }

  const fetchUserCampaigns = function* () {
    try {
      yield put(A.fetchUserCampaignsLoading())
      yield call(waitForUserData)
      const userCampaigns = yield call(api.getUserCampaigns)
      yield put(A.fetchUserCampaignsSuccess(userCampaigns))
    } catch (e) {
      yield put(A.fetchUserCampaignsFailure(e))
    }
  }

  const fetchUserRiskSettings = function* () {
    try {
      yield put(A.fetchUserRiskSettingsLoading())
      yield call(waitForUserData)
      const userRiskSettings = yield call(api.getUserRiskSettings)
      yield put(A.fetchUserRiskSettingsSuccess(userRiskSettings))
    } catch (e) {
      yield put(A.fetchUserRiskSettingsFailure(e))
    }
  }

  const clearSession = function* () {
    if (renewSessionTask) {
      // @ts-ignore
      yield cancel(renewSessionTask)
      renewSessionTask = null
    }
    if (renewUserTask) {
      // @ts-ignore
      yield cancel(renewUserTask)
      renewUserTask = null
    }

    yield put(A.setApiTokenNotAsked())
  }

  const generateAuthCredentials = function* () {
    const retailToken = yield call(generateRetailToken)
    const { token: nabuLifetimeToken, userId: nabuUserId } = yield call(
      api.createOrGetUser,
      retailToken
    )
    // write to both to support legacy mobile clients
    // TODO: in future, consider just writing to unifiedCredentials entry
    yield put(
      actions.core.kvStore.userCredentials.setUserCredentials(nabuUserId, nabuLifetimeToken)
    )
    yield take([
      actionTypes.core.kvStore.userCredentials.FETCH_METADATA_USER_CREDENTIALS_SUCCESS,
      actionTypes.core.kvStore.userCredentials.FETCH_METADATA_USER_CREDENTIALS_FAILURE
    ])

    yield put(
      actions.core.kvStore.unifiedCredentials.setUnifiedCredentials({
        nabu_lifetime_token: nabuLifetimeToken,
        nabu_user_id: nabuUserId
      })
    )

    return { nabuLifetimeToken, nabuUserId }
  }

  const generateExchangeAuthCredentials = function* (countryCode) {
    const { platform, product, referrerUsername, tuneTid } = yield select(
      selectors.signup.getProductSignupMetadata
    )
    try {
      const retailToken = yield call(generateRetailToken)
      const { token: exchangeLifetimeToken, userId: exchangeUserId } = yield call(
        api.createExchangeUser,
        countryCode,
        referrerUsername,
        retailToken,
        tuneTid
      )

      yield put(
        actions.core.kvStore.unifiedCredentials.setUnifiedCredentials({
          exchange_lifetime_token: exchangeLifetimeToken,
          exchange_user_id: exchangeUserId
        })
      )
      return { exchangeLifetimeToken, exchangeUserId }
    } catch (e) {
      if (e.code === 4) {
        yield put(actions.auth.setExchangeAccountConflict(true))
        // If it's an exchange mobile signup, we want to take user
        // directly to conflict error message
        if (
          product === ProductAuthOptions.EXCHANGE &&
          (platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS)
        ) {
          yield put(actions.router.push('/select-product'))
        }
      }
      yield put(actions.auth.loginFailure(e.code))
      yield put(actions.auth.setExchangeAccountCreationFailure(true))
    }
  }

  const createExchangeUser = function* (countryCode) {
    try {
      const { exchangeLifetimeToken, exchangeUserId } = (yield select(
        selectors.core.kvStore.unifiedCredentials.getExchangeCredentials
      )).getOrElse({})
      if (!exchangeUserId || !exchangeLifetimeToken) {
        yield call(generateExchangeAuthCredentials, countryCode)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'exchangeUserCreation', e))
    }
  }

  const authAndRouteToExchangeAction = function* (action) {
    const { origin } = action.payload
    try {
      const retailToken = yield call(generateRetailToken)
      const { platform: loginPlatform, redirect } = yield select(
        selectors.auth.getProductAuthMetadata
      )
      const { platform: signupPlatform } = yield select(selectors.signup.getProductSignupMetadata)
      // login platform and signup platform come from two different locations
      // set const to whichever one exists
      const platform = signupPlatform || loginPlatform
      const isMobileExchangeSignup =
        platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS
      const magicLinkData: AuthMagicLink = yield select(selectors.auth.getMagicLinkData)
      const exchangeAuthUrl = magicLinkData?.exchange_auth_url
      const { exchange: exchangeDomain } = selectors.core.walletOptions
        .getDomains(yield select())
        .getOrElse({
          exchange: 'https://exchange.blockchain.com'
        } as WalletOptionsType['domains'])
      const exchangeUrlFromLink = exchangeAuthUrl || redirect
      const { exchangeLifetimeToken, exchangeUserId } = (yield select(
        selectors.core.kvStore.unifiedCredentials.getExchangeCredentials
      )).getOrElse({})

      if (!exchangeUserId || !exchangeLifetimeToken) {
        if (origin === ExchangeAuthOriginType.Signup && !isMobileExchangeSignup) {
          return
        }
        if (origin === ExchangeAuthOriginType.SideMenu) {
          return window.open(`${exchangeDomain}`, '_blank', 'noreferrer')
        }
      }
      const { csrfToken, sessionExpirationTime, token } = yield call(
        api.getExchangeAuthToken,
        exchangeLifetimeToken,
        exchangeUserId,
        retailToken
      )
      switch (true) {
        case isMobileExchangeSignup:
          sendMessageToMobile(platform, {
            data: { csrf: csrfToken, jwt: token, jwtExpirationTime: sessionExpirationTime },
            status: 'success'
          })
          yield put(actions.signup.registerSuccess(undefined))
          break
        case origin === ExchangeAuthOriginType.SideMenu:
          window.open(`${exchangeDomain}/trade/auth?jwt=${token}`, '_blank', 'noreferrer')
          break
        case exchangeUrlFromLink:
          window.open(`${exchangeUrlFromLink}${token}`, '_self', 'noreferrer')
          break
        default:
          window.open(`${exchangeDomain}/trade/auth?jwt=${token}`, '_self', 'noreferrer')
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'exchangeLoginToken', e))
      yield put(actions.auth.exchangeLoginFailure(e?.code))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.LOGIN_PASSWORD_DENIED,
          properties: {
            site_redirect: 'EXCHANGE',
            unified: true
          }
        })
      )
      yield put(stopSubmit(LOGIN_FORM))
    }
  }
  const createUser = function* () {
    const token = yield select(S.getApiToken)
    if (!Remote.NotAsked.is(token)) return

    const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
    const guid = yield select(selectors.core.wallet.getGuid)
    const nabuCredentialsR = yield select(
      selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
    )

    const { nabuLifetimeToken, nabuUserId } = yield nabuCredentialsR
      .map((nabuCredentials) => {
        if (!nabuCredentials || !nabuCredentials.nabuLifetimeToken || !nabuCredentials.nabuUserId)
          return call(generateAuthCredentials)
        return nabuCredentials
      })
      .getOrElse({} as ExtractSuccess<typeof nabuCredentialsR>)
    yield call(setSession, nabuUserId, nabuLifetimeToken, email, guid)
  }

  const updateUser = function* ({ payload }) {
    const { data } = payload
    const userR = S.getUserData(yield select())
    const user = userR.getOrElse({
      address: undefined,
      id: '',
      kycState: 'NONE',
      mobile: '',
      mobileVerified: false,
      state: 'NONE'
    } as UserDataType)
    /* eslint-disable */
    const { id, address, mobile, mobileVerified, state, kycState, ...userData } = user
    /* eslint-enable */
    const updatedData = { ...userData, ...data }

    if (equals(updatedData, userData)) return user

    yield call(api.updateUser, updatedData)
    return yield call(fetchUser)
  }

  const updateUserAddress = function* ({ payload }) {
    const { address } = payload
    const user = (yield select(S.getUserData)).getOrElse({})
    const { address: prevAddress } = user

    if (equals(address, prevAddress)) return user

    yield call(api.updateUserAddress, address)
    return yield call(fetchUser)
  }

  const syncUserWithWallet = function* () {
    const retailToken = yield call(generateRetailToken)
    const userData = yield call(api.syncUserWithWallet, retailToken)
    yield put(A.fetchUserDataSuccess(userData))
  }

  const shareWalletAddressesWithExchange = function* () {
    try {
      yield put(A.shareWalletAddressesWithExchangeLoading())
      const state = yield select()
      const remainingCoins = S.getRemainingCoins(state)
      const walletAddresses = (yield select(S.getWalletAddresses)).getOrFail('no_deposit_addresses')
      // BTC
      const defaultAccountIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultDerivation = yield select(
        selectors.core.common.btc.getAccountDefaultDerivation(defaultAccountIndex, state)
      )
      const BTC = selectors.core.common.btc.getNextAvailableReceiveAddress(
        networks.btc,
        defaultAccountIndex,
        defaultDerivation
      )
      // BCH
      const BCH = selectors.core.common.bch.getNextAvailableReceiveAddressFormatted(
        networks.btc,
        defaultAccountIndex
      )
      // ETH
      const ETH = selectors.core.kvStore.eth.getContext
      // XLM
      const XLM = selectors.core.kvStore.xlm.getDefaultAccountId
      const addressSelectors = { BCH, BTC, ETH, PAX: ETH, USDT: ETH, XLM }
      const remainingAddresses = remainingCoins.reduce((res, coin) => {
        res[coin] = addressSelectors[coin](state).getOrElse(null)
        return res
      }, walletAddresses)
      const data = yield call(api.shareWalletDepositAddresses, remainingAddresses)
      yield put(A.shareWalletAddressesWithExchangeSuccess(data))
    } catch (e) {
      yield put(A.shareWalletAddressesWithExchangeFailure(e))
    }
  }

  const linkFromExchangeAccount = function* ({ payload }) {
    try {
      const { address, email, linkId } = payload
      yield put(A.linkFromExchangeAccountLoading())
      // ensure email is verified else wait
      const isEmailVerified = (yield select(selectors.core.settings.getEmailVerified)).getOrElse(
        true
      )
      if (!isEmailVerified) yield take(actionTypes.core.settings.SET_EMAIL_VERIFIED)
      // get or create user
      const isUserStateNone = (yield select(S.isUserStateNone)).getOrElse(false)
      if (isUserStateNone) yield call(createUser)
      // link Account
      const data = yield call(api.linkAccount, linkId, email, address)
      // share addresses
      yield put(A.shareWalletAddressesWithExchange())
      yield put(A.linkFromExchangeAccountSuccess(data))
      // finalise linking
      yield call(api.finaliseLinking)
      // update user
      yield call(fetchUser)
    } catch (e) {
      yield put(A.linkFromExchangeAccountFailure(e))
    }
  }

  const pollForAccountLinkSuccess = function* (attemptCount) {
    try {
      // check every 10 seconds
      yield delay(10000)
      /* eslint-disable */
      attemptCount++
      /* eslint-disable */
      // if 5 minutes has passed, cancel poll and mark as timeout
      if (equals(30, attemptCount)) {
        yield put(A.linkToExchangeAccountFailure('Timeout waiting for account connection status.'))
        return
      }
      yield call(fetchUser)
      const isExchangeAccountLinked = (yield select(S.isExchangeAccountLinked)).getOrElse(false)
      if (isExchangeAccountLinked) {
        yield put(A.linkToExchangeAccountSuccess())
      } else {
        yield call(pollForAccountLinkSuccess, attemptCount)
      }
    } catch (e) {
      yield put(A.linkToExchangeAccountFailure('Unable to check current account status.'))
    }
  }

  const signIn = function* ({ payload }: ReturnType<typeof A.signIn>) {
    try {
      const { firstLogin } = payload
      const email = (yield select(selectors.core.settings.getEmail)).getOrFail('No email')
      const guid = yield select(selectors.core.wallet.getGuid)
      const createNewUser = (yield select(
        selectors.core.walletOptions.createNabuUserAtLogin
      )).getOrElse(false)
      // TODO: in future only fetch unified credentials
      const unifiedNabuCredentialsR = yield select(
        selectors.core.kvStore.unifiedCredentials.getNabuCredentials
      )
      const userCredentialsR = yield select(
        selectors.core.kvStore.userCredentials.getLegacyNabuCredentials
      )
      if (!Remote.Success.is(unifiedNabuCredentialsR)) {
        yield call(coreSagas.kvStore.unifiedCredentials.fetchMetadataUnifiedCredentials)
      }
      if (!Remote.Success.is(userCredentialsR)) {
        yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      }
      const { nabuLifetimeToken, nabuUserId } = (yield select(
        selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
      )).getOrElse({})
      // sync legacy nabu credentials with unified kv entry
      const unifiedNabuCredentials = (yield select(
        selectors.core.kvStore.unifiedCredentials.getNabuCredentials
      )).getOrElse({})
      if (!unifiedNabuCredentials.nabuUserId || !unifiedNabuCredentials.nabuLifetimeToken) {
        yield put(
          actions.core.kvStore.unifiedCredentials.setUnifiedCredentials({
            nabu_lifetime_token: nabuLifetimeToken,
            nabu_user_id: nabuUserId
          })
        )
      }
      if (!firstLogin && createNewUser && (!nabuUserId || !nabuLifetimeToken)) {
        yield call(createUser)
      }
      if (!nabuUserId || !nabuLifetimeToken) {
        return yield put(
          A.fetchUserDataSuccess({
            kycState: KYC_STATES.NONE,
            state: USER_ACTIVATION_STATES.NONE
          })
        )
      }
      yield put(A.setApiTokenLoading())

      yield put(actions.modules.profile.fetchUserRiskSettings())

      const isFlowInRiskSettings = selectors.modules.profile.isFlowInRiskSettings(
        yield select(),
        'ONBOARDING'
      )

      if (window?._SardineContext && isFlowInRiskSettings) {
        window._SardineContext.updateConfig({
          flow: 'ONBOARDING',
          userIdHash: sha256(unifiedNabuCredentials.nabuUserId).toString()
        })
      }

      renewSessionTask = yield fork(renewSession, nabuUserId, nabuLifetimeToken, email, guid, 0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'signIn', e))
    }
  }

  const linkToExchangeAccount = function* ({ payload }) {
    try {
      const { utmCampaign } = payload
      yield put(A.linkToExchangeAccountLoading())

      // check if wallet is already linked
      const isExchangeAccountLinked = (yield select(S.isExchangeAccountLinked)).getOrFail()
      if (isExchangeAccountLinked) {
        throw new Error('Account has already been linked.')
      }

      // ensure email address is verified
      const isEmailVerified = (yield select(selectors.core.settings.getEmailVerified)).getOrFail()
      if (!isEmailVerified) {
        throw new Error('Email address is not verified.')
      }

      // check if wallet relink should be attempted
      const isRelinkAttempt = (yield select(S.isExchangeRelinkRequired)).getOrFail()

      if (isRelinkAttempt) {
        yield put(A.shareWalletAddressesWithExchange())
        return yield put(actions.modals.closeAllModals())
      } else {
        // get or create nabu user
        const isUserStateNone = (yield select(S.isUserStateNone)).getOrFail()
        if (isUserStateNone) yield call(createUser)
        // get exchange linkId, exchange domain and user email
        const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrFail()
        const exchangeDomain = prop('exchange', domains)
        const data = yield call(api.createLinkAccountId)
        const exchangeLinkId = prop('linkId', data)
        const email = (yield select(selectors.core.settings.getEmail)).getOrFail()
        const accountDeeplinkUrl = `${exchangeDomain}/trade/link/${exchangeLinkId}?email=${encodeURIComponent(
          email
        )}&utm_source=web_wallet&utm_medium=referral&utm_campaign=${
          utmCampaign || 'wallet_exchange_page'
        }`
        // share addresses
        yield put(A.shareWalletAddressesWithExchange())
        // simulate wait while allowing user to read modal
        yield delay(2000)
        // attempt to open url for user
        window.open(accountDeeplinkUrl, '_blank', 'noreferrer')
        yield put(A.setLinkToExchangeAccountDeepLink(accountDeeplinkUrl))
        // poll for account link
        yield race({
          task: call(pollForAccountLinkSuccess, 0),
          cancel: take([
            AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE,
            AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS,
            actions.modals.closeModal.type
          ])
        })
      }
    } catch (e) {
      yield put(A.linkToExchangeAccountFailure(e.message))
    }
  }

  return {
    authAndRouteToExchangeAction,
    clearSession,
    createExchangeUser,
    createUser,
    fetchTiers,
    fetchUser,
    fetchUserCampaigns,
    fetchUserRiskSettings,
    generateAuthCredentials,
    generateExchangeAuthCredentials,
    generateRetailToken,
    getCampaignData,
    isTier2,
    linkFromExchangeAccount,
    linkToExchangeAccount,
    recoverUser,
    renewApiSockets,
    renewSession,
    renewUser,
    setSession,
    shareWalletAddressesWithExchange,
    signIn,
    syncUserWithWallet,
    updateUser,
    updateUserAddress,
    waitForUserData
  }
}
