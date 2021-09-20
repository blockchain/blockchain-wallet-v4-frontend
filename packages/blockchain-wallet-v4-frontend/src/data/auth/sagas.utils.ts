import { call, put } from 'redux-saga/effects'

import { actions } from 'data'
import * as C from 'services/alerts'

import { LoginSteps, WalletDataFromMagicLink, WalletDataFromMagicLinkLegacy } from './types'

const logLocation = 'auth/sagas'
// TODO: remove once old magic link endpoint is deprecated
const parseMagicLinkLegacy = function* (params) {
  try {
    const loginData = JSON.parse(atob(params[2])) as WalletDataFromMagicLinkLegacy
    // this flag is stored as a string in JSON object this converts it to a variable
    const mobileSetup = loginData.is_mobile_setup === 'true'
    // store data in the cache and update form values to be used to submit login
    yield put(actions.cache.emailStored(loginData.email))
    yield put(actions.cache.guidStored(loginData.guid))
    yield put(actions.cache.mobileConnectedStored(mobileSetup))
    yield put(actions.form.change('login', 'emailToken', loginData.email_code))
    yield put(actions.form.change('login', 'guid', loginData.guid))
    yield put(actions.form.change('login', 'email', loginData.email))
    // check if mobile detected
    if (mobileSetup) {
      yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
    } else {
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
    }
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'parseLink', e))
    yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
  }
}

export const parseMagicLink = function* (params) {
  try {
    const loginData = JSON.parse(atob(params[2])) as WalletDataFromMagicLink
    // TODO: remove this check once old magic link is deprecated
    if (loginData.wallet) {
      const walletData = loginData.wallet
      // grab all the data from the JSON wallet data
      // store data in the cache and update form values to be used to submit login
      yield put(actions.cache.emailStored(walletData.email))
      yield put(actions.cache.guidStored(walletData.guid))
      yield put(actions.cache.mobileConnectedStored(walletData.is_mobile_setup))
      yield put(actions.form.change('login', 'emailToken', walletData.email_code))
      yield put(actions.form.change('login', 'guid', walletData.guid))
      yield put(actions.form.change('login', 'email', walletData.email))
      yield put(actions.auth.setMagicLinkInfo(loginData))
      // check if mobile detected
      if (walletData.is_mobile_setup) {
        yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
      } else {
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
      }
    } else {
      yield call(parseMagicLinkLegacy, params)
    }
    yield put(actions.auth.magicLinkParsed())
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'parseLink', e))
    yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
    yield put(actions.alerts.displayError(C.MAGIC_LINK_PARSE_ERROR))
  }
}
