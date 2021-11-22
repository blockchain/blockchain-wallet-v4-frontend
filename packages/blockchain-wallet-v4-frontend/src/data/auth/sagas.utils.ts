import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import { LoginSteps } from './types'

const logLocation = 'auth/sagas'

export const parseMagicLink = function* () {
  try {
    const loginData = yield select(selectors.auth.getMagicLinkData)
    const walletData = loginData.wallet
    const session = yield select(selectors.session.getSession, walletData.guid, walletData.email)
    const sessionIdFromLink = walletData.session_id
    // Remove feature flag when not neccessary
    const pollForMagicLinkData = (yield select(
      selectors.core.walletOptions.getPollForMagicLinkData
    )).getOrElse(false)
    if (session !== sessionIdFromLink && pollForMagicLinkData) {
      yield put(actions.auth.authorizeVerifyDevice())
      yield put(actions.form.change('login', 'step', LoginSteps.VERIFY_MAGIC_LINK))
    } else {
      // grab all the data from the JSON wallet data
      // store data in the cache and update form values to be used to submit login
      yield put(actions.cache.emailStored(walletData.email))
      yield put(actions.cache.guidStored(walletData.guid))
      yield put(actions.cache.mobileConnectedStored(walletData.is_mobile_setup))
      yield put(actions.cache.hasCloudBackup(walletData.has_cloud_backup))
      yield put(actions.form.change('login', 'emailToken', walletData.email_code))
      yield put(actions.form.change('login', 'guid', walletData.guid))
      yield put(actions.form.change('login', 'email', walletData.email))
      yield put(actions.auth.setMagicLinkInfo(loginData))
      // check if mobile detected
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
      yield put(actions.auth.magicLinkParsed())
    }
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'parseLink', e))
    yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
    yield put(actions.alerts.displayError(C.MAGIC_LINK_PARSE_ERROR))
  }
}
