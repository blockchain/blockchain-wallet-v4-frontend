import { prop } from 'ramda'
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

// TODO: cleanup this function
export const parseAuthMagicLink = function* () {
  try {
    const magicLink = yield select(selectors.auth.getMagicLinkData)
    const formValues = yield select(selectors.form.getFormValues(LOGIN_FORM))
    const {
      exchange: exchangeData,
      mergeable,
      platform_type,
      product,
      session_id,
      unified,
      upgradeable,
      wallet: walletData
    } = magicLink as AuthMagicLink
    const userEmail = walletData?.email || exchangeData?.email || formValues?.email
    // eslint-disable-next-line
    console.log('MAGIC LINK:: ', magicLink)
    const session = yield select(selectors.session.getSession, walletData?.guid, userEmail)
    // feature flag for merge and upgrade wallet + exchange
    // shipping signup first before
    const showMergeAndUpgradeFlows = (yield select(
      selectors.core.walletOptions.getMergeAndUpgradeAccounts
    )).getOrElse(false)
    // remove feature flag when not necessary
    const shouldPollForMagicLinkData = (yield select(
      selectors.core.walletOptions.getPollForMagicLinkData
    )).getOrElse(false)
    // handles cases where we don't yet know which product user wants to authenticate to
    // if there's only wallet data or exchange data, we can deduce which product they want
    let productAuth = product
    if (!product) {
      if (exchangeData && !walletData) {
        productAuth = ProductAuthOptions.EXCHANGE
      }
      if (walletData && !exchangeData) {
        productAuth = ProductAuthOptions.WALLET
      }
    }
    // THESE ARE THE MERGE AND UPGRADE FLOWS
    // showMergeAndUpgradeFlows is the feature flag
    if (showMergeAndUpgradeFlows) {
      if (!unified && (mergeable || upgradeable)) {
        if (productAuth === ProductAuthOptions.WALLET && mergeable) {
          // send them to wallet password screen
          yield put(
            actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.WALLET_MERGE)
          )
        }
        if (productAuth === ProductAuthOptions.EXCHANGE && mergeable) {
          // send them to exchange password screen
          yield put(
            actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_MERGE)
          )
        }
        if (productAuth === ProductAuthOptions.EXCHANGE && upgradeable) {
          // send them to exchange password screen
          yield put(
            actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_UPGRADE)
          )
        }
      } else if (unified) {
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.UNIFIED)
      }
    }

    // store data in the cache and update form values to be used to submit login
    if (productAuth === ProductAuthOptions.WALLET) {
      if (session !== session_id && shouldPollForMagicLinkData) {
        // undefined because we're not yet confirming or rejecting
        // device authorization
        yield put(actions.auth.authorizeVerifyDevice(undefined))
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFY_MAGIC_LINK))
      } else {
        // grab all the data from the JSON wallet data
        // store data in the cache and update form values to be used to submit login
        yield put(actions.cache.emailStored(walletData?.email))
        yield put(actions.cache.guidStored(walletData?.guid))
        yield put(actions.cache.mobileConnectedStored(walletData?.is_mobile_setup))
        yield put(actions.cache.hasCloudBackup(walletData?.has_cloud_backup))
        yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
        yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
        yield put(actions.form.change(LOGIN_FORM, 'email', walletData?.email))
        yield put(actions.auth.setMagicLinkInfo(magicLink))
        // TODO: probably dont hardcode the platform
        yield put(
          actions.auth.setProductAuthMetadata({
            platform: PlatformTypes.WEB,
            product: ProductAuthOptions.WALLET
          })
        )
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
      }
    }
    if (productAuth === ProductAuthOptions.EXCHANGE) {
      if (session !== session_id && shouldPollForMagicLinkData) {
        // Exchange only logins don't require any challenges
        // `true` means we can confirm device verification right away
        // Less security concern compared to wallet
        yield put(actions.auth.authorizeVerifyDevice(true))
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFY_MAGIC_LINK))
      } else {
        // set state with all exchange login information
        yield put(actions.cache.exchangeEmail(exchangeData?.email))
        yield put(actions.form.change(LOGIN_FORM, 'exchangeEmail', exchangeData?.email))
        if (walletData) {
          yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
          yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
        }
        yield put(actions.auth.setMagicLinkInfo(magicLink))
        yield put(
          actions.auth.setProductAuthMetadata({
            platform: platform_type as PlatformTypes,
            product: ProductAuthOptions.EXCHANGE
          })
        )
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
      }
      // if the account is unified, they're using wallet to login and retrieve token
      // TODO** need to fix logic here, not sure what to do with this
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
    if (prop('guid', response)) {
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
    if (prop('wallet', response) || prop('exchange', response)) {
      yield put(actions.auth.setMagicLinkInfo(response))
      yield call(parseAuthMagicLink)
      return true
    }
    if (response.request_denied) {
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID))
      yield put(actions.alerts.displayError(C.VERIFY_DEVICE_FAILED, undefined, true))
      return false
    }
  } catch (error) {
    return false
  }
  return yield call(pollForSessionFromAuthPayload, api, session, n - 1)
}
