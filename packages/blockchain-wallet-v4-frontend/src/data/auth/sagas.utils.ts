import { call, delay, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import { LOGIN_FORM } from './model'
import {
  AccountUnificationFlows,
  AuthMagicLink,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from './types'

// checks if merge/upgrade flows are enabled. if they are and the user is eligible then initiate those flows
const checkAndExecuteMergeAndUpgradeFlows = function* (productAuthenticatingInto, authMagicLink) {
  const runMergeAndUpgradeFlows = (yield select(
    selectors.core.walletOptions.getMergeAndUpgradeAccounts
  )).getOrElse(false)

  if (runMergeAndUpgradeFlows) {
    const { mergeable, unified, upgradeable } = authMagicLink
    if (!unified && (mergeable || upgradeable)) {
      if (productAuthenticatingInto === ProductAuthOptions.WALLET && mergeable) {
        // send them to wallet password screen
        yield put(actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.WALLET_MERGE))
      }
      if (productAuthenticatingInto === ProductAuthOptions.EXCHANGE && mergeable) {
        // send them to exchange password screen
        yield put(
          actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_MERGE)
        )
      }
      if (productAuthenticatingInto === ProductAuthOptions.EXCHANGE && upgradeable) {
        // send them to exchange password screen
        yield put(
          actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_UPGRADE)
        )
      }
    } else if (unified) {
      // TODO: what does this do? is it needed?
      actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.UNIFIED)
    }
  }
}

export const determineAuthenticationFlow = function* (skipSessionCheck?: boolean) {
  try {
    const authMagicLink = yield select(selectors.auth.getMagicLinkData)
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const {
      exchange: exchangeData,
      platform_type: platformType,
      product,
      wallet: walletData
    } = authMagicLink as AuthMagicLink
    // handles cases where we don't yet know which product user wants to authenticate to
    // if there's only wallet data or exchange data, we can deduce which product they want
    let productAuthenticatingInto = product
    if (!product) {
      if (exchangeData && !walletData) {
        productAuthenticatingInto = ProductAuthOptions.EXCHANGE
      }
      if (walletData && !exchangeData) {
        productAuthenticatingInto = ProductAuthOptions.WALLET
      }
    }
    const userEmail = walletData?.email || exchangeData?.email || formValues?.email
    const currentLoginSession = yield select(
      selectors.session.getSession,
      walletData?.guid,
      userEmail
    )

    // check if merge and upgrade flows are enabled and execute them if needed
    yield call(checkAndExecuteMergeAndUpgradeFlows, productAuthenticatingInto, authMagicLink)

    // detect if device/session verification is required or can be bypassed
    // if device/session checks are not required, determine which product specific
    // authentication flow is required and execute
    switch (true) {
      // EXCHANGE AUTHENTICATION AND DEVICE VERIFICATION
      case productAuthenticatingInto === ProductAuthOptions.EXCHANGE:
        // determine if we need to verify the login attempt from another device or
        // continue login from the same device
        if (currentLoginSession !== authMagicLink.session_id && !skipSessionCheck) {
          // EXCHANGE DEVICE VERIFICATION
          // Exchange only logins don't require any challenges and passing
          // `true` means we can confirm device verification right away
          yield put(actions.auth.authorizeVerifyDevice(true))
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFY_MAGIC_LINK))
        } else {
          // EXCHANGE AUTHENTICATION
          // set state with all exchange login information
          yield put(actions.cache.exchangeEmail(exchangeData?.email))
          yield put(actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeData?.email))
          if (walletData) {
            yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
            yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
          }
          yield put(actions.auth.setMagicLinkInfo(authMagicLink))
          yield put(
            actions.auth.setProductAuthMetadata({
              platform: platformType as PlatformTypes,
              product: ProductAuthOptions.EXCHANGE
            })
          )
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
        }
        break
      // WALLET DEVICE VERIFICATION
      case productAuthenticatingInto === ProductAuthOptions.WALLET &&
        currentLoginSession !== authMagicLink.session_id:
        yield put(actions.auth.authorizeVerifyDevice(undefined))
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFY_MAGIC_LINK))
        break
      // WALLET AUTHENTICATION FLOW
      default:
        // grab all the data from the JSON wallet data
        // store data in the cache and update form values to be used to submit login
        yield put(actions.cache.emailStored(walletData?.email))
        yield put(actions.cache.guidStored(walletData?.guid))
        yield put(actions.cache.mobileConnectedStored(walletData?.is_mobile_setup))
        yield put(actions.cache.hasCloudBackup(walletData?.has_cloud_backup))
        yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
        yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
        yield put(actions.form.change(LOGIN_FORM, 'email', walletData?.email))
        yield put(actions.auth.setMagicLinkInfo(authMagicLink))
        yield put(
          actions.auth.setProductAuthMetadata({
            platform: PlatformTypes.WEB, // TODO: probably dont hardcode the platform
            product: ProductAuthOptions.WALLET
          })
        )
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
        break
    }
    yield put(actions.auth.analyticsMagicLinkParsed())
  } catch (e) {
    yield put(actions.logs.logErrorMessage('auth/sagas.utils', 'parseLink', e))
    yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
    yield put(actions.alerts.displayError(C.MAGIC_LINK_PARSE_ERROR))
  }
}

export const pollForSessionFromGuid = function* (api, session, n = 50) {
  if (n === 0) {
    return false
  }
  try {
    yield delay(2000)
    const response = yield call(api.pollForSessionGUID, session)
    if (response?.guid) {
      return true
    }
  } catch (error) {
    return false
  }
  return yield call(pollForSessionFromGuid, api, session, n - 1)
}

export const pollForSessionFromAuthPayload = function* (api, session, n = 50) {
  if (n === 0) {
    yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
    yield put(actions.alerts.displayInfo(C.VERIFY_DEVICE_EXPIRY, undefined, true))
    yield put(actions.auth.analyticsAuthorizeVerifyDeviceFailure('TIMED_OUT'))
    return false
  }
  try {
    yield delay(2000)
    const response = yield call(api.getMagicLinkData, session)
    const isLoggedIn = (yield select(selectors.auth.getLogin)).getOrElse(false)
    if (isLoggedIn) {
      return true
    }
    if (response?.wallet || response?.exchange) {
      yield put(actions.auth.setMagicLinkInfo(response))
      // pass 'true' to bypass the sessionId check for Exchange only logins if they dont match
      yield call(determineAuthenticationFlow, true)
      return true
    }
    if (response?.request_denied) {
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
      yield put(actions.alerts.displayError(C.VERIFY_DEVICE_FAILED, undefined, true))
      return false
    }
  } catch (error) {
    return false
  }
  return yield call(pollForSessionFromAuthPayload, api, session, n - 1)
}
