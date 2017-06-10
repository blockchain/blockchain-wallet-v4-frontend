import { delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { prop, assoc } from 'ramda'

import { coreActions } from 'dream-wallet/lib'
import * as rootSelectors from 'data/rootSelectors.js'

import * as actions from './actions.js'
import * as authActions from '../Log/actions.js'
import { getSession } from './selectors'
import { api } from 'services/walletApi.js'

const pollingSaga = function * (session, n = 50) {
  if (n === 0) { return false }
  try {
    yield call(delay, 2000)
    let response = yield call(api.pollForSessioGUID, session)
    if (prop('guid', response)) { return true }
  } catch (error) {
    return false
  }
  return yield call(pollingSaga, session, n - 1)
}

const fetchWalletSaga = function * (guid, sharedKey, session, password) {
  try {
    let wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password)
    yield put(coreActions.wallet.replaceWallet(wrapper))
    const context = yield select(rootSelectors.core.wallet.getWalletContext)
    yield put(coreActions.common.requestWalletData(context))
    const sk = yield select(rootSelectors.core.wallet.getSharedKey)
    yield put(coreActions.settings.requestSettingsData({guid, sharedKey: sk}))
    yield put(actions.loginSuccess())
    yield put(push('/wallet'))
  } catch (error) {
    console.log(error)
    if (prop('authorization_required', JSON.parse(error))) {
      let authorized = yield call(pollingSaga, session)
      if (authorized) {
        yield call(fetchWalletSaga, guid, undefined, session, password)
      }
    } else {
      yield put(authActions.recordLog({ type: 'ERROR', message: error.message }))
    }
  }
}

const login = function * (action) {
  const credentials = action.payload
  // login with shared key
  if (credentials.sharedKey) {
    yield call(fetchWalletSaga, credentials.guid, credentials.sharedKey, undefined, credentials.password)
  } else {
    let session = yield select(getSession(credentials.guid))
    session = yield call(api.establishSession, session)  // establishSession logic should not receive existent session as parameter
    yield put(actions.saveSession(assoc(credentials.guid, session, {})))
    yield call(fetchWalletSaga, credentials.guid, undefined, session, credentials.password)
  }
}

export default {
  login: login
}
