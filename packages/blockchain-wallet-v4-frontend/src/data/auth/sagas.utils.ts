import { prop } from 'ramda'
import { call, delay, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import { LOGIN_FORM } from './model'
import { AccountUnificationFlows, LoginSteps, PlatformTypes, ProductAuthOptions } from './types'

const logLocation = 'auth/sagas'

// TODO: cleanup this function
export const parseMagicLink = function* () {
  try {
    const magicLink = yield select(selectors.auth.getMagicLinkData)
    const {
      exchange: exchangeData,
      mergeable,
      product,
      unified,
      upgradeable,
      wallet: walletData
    } = magicLink
    const session = yield select(selectors.session.getSession, walletData.guid, walletData.email)
    const sessionIdFromLink = walletData.session_id
    // remove feature flag when not necessary
    const shouldPollForMagicLinkData = (yield select(
      selectors.core.walletOptions.getPollForMagicLinkData
    )).getOrElse(false)
    if (session !== sessionIdFromLink && shouldPollForMagicLinkData) {
      // TODO: question for merge, do we need the next line?
      yield put(actions.auth.authorizeVerifyDevice())
      yield put(actions.form.change('login', 'step', LoginSteps.VERIFY_MAGIC_LINK))
    }
    if (!unified && (mergeable || upgradeable)) {
      if (product === ProductAuthOptions.WALLET && mergeable) {
        // send them to wallet password screen
        yield put(actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.WALLET_MERGE))
      }
      if (product === ProductAuthOptions.EXCHANGE && mergeable) {
        // send them to exchange password screen
        yield put(
          actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_MERGE)
        )
      }
      if (product === ProductAuthOptions.EXCHANGE && upgradeable) {
        // send them to exchange password screen
        yield put(
          actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.EXCHANGE_UPGRADE)
        )
      }
    }
    // store data in the cache and update form values to be used to submit login
    if (product === ProductAuthOptions.WALLET) {
      if (session !== sessionIdFromLink && shouldPollForMagicLinkData) {
        // TODO: question for merge, do we need the next line?
        yield put(actions.auth.authorizeVerifyDevice())
        yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFY_MAGIC_LINK))
      } else {
        // grab all the data from the JSON wallet data
        // store data in the cache and update form values to be used to submit login
        yield put(actions.cache.emailStored(walletData?.email))
        yield put(actions.cache.guidStored(walletData?.guid))
        yield put(actions.cache.mobileConnectedStored(walletData?.is_mobile_setup))
        yield put(actions.cache.hasCloudBackup(walletData.has_cloud_backup))
        yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
        yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
        yield put(actions.form.change(LOGIN_FORM, 'email', walletData?.email))
        yield put(actions.auth.setMagicLinkInfo(magicLink))
        yield put(
          actions.auth.setProductAuthMetadata({
            platform: PlatformTypes.WEB,
            product: ProductAuthOptions.WALLET
          })
        )
        // check if mobile detected
        if (walletData?.is_mobile_setup) {
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.VERIFICATION_MOBILE))
        } else {
          yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
        }
      }
    }
    if (product === ProductAuthOptions.EXCHANGE) {
      // set state with all exchange login information
      yield put(actions.cache.emailStored(exchangeData?.email))
      yield put(actions.form.change(LOGIN_FORM, 'email', exchangeData?.email))
      if (walletData) {
        yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
        yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
      }
      yield put(actions.auth.setMagicLinkInfo(magicLink))
      yield put(
        actions.auth.setProductAuthMetadata({
          platform: PlatformTypes.WEB,
          product: ProductAuthOptions.EXCHANGE
        })
      )
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
    }
    yield put(actions.auth.analyticsMagicLinkParsed())
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'parseLink', e))
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
    if (prop('wallet', response)) {
      yield put(actions.auth.setMagicLinkInfo(response))
      yield call(parseMagicLink)
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
