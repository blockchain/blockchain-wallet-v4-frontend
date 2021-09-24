import { call, put } from 'redux-saga/effects'

import { actions } from 'data'
import * as C from 'services/alerts'

import {
  AccountUnificationFlows,
  LoginSteps,
  ProductAuthOptions,
  WalletDataFromMagicLink
} from './types'

const logLocation = 'auth/sagas'

export const parseMagicLink = function* (params) {
  try {
    const loginData = JSON.parse(atob(params[2])) as WalletDataFromMagicLink
    const { mergeable, product, unified, upgradeable, wallet: walletData } = loginData
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
    }
    if (product === ProductAuthOptions.EXCHANGE) {
      // set state with all exchange login information
    }
    yield put(actions.auth.magicLinkParsed())
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'parseLink', e))
    yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
    yield put(actions.alerts.displayError(C.MAGIC_LINK_PARSE_ERROR))
  }
}

export const determineAuthFlow = function* () {}
