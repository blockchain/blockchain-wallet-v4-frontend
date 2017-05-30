import { call, put, select } from 'redux-saga/effects'
import Promise from 'es6-promise'
import { prop, assoc } from 'ramda'
import * as walletActions from 'dream-wallet/lib/actions'
import { getWalletContext } from 'dream-wallet/lib/selectors'

import * as actions from './actions.js'
import { getSession } from './selectors'
import { api } from 'services/walletApi.js'

Promise.polyfill()

const delay = ms => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), ms)
  })
}

const pollingSaga = function * (session) {
  let rounds = 50
  while (rounds > 0) {
    rounds--
    try {
      yield call(delay, 2000)
      let response = yield call(api.pollForSessioGUID, session)
      let guid = prop('guid', response)
      if (guid) {
        // authorized
        return true
      }
    } catch (error) {
      // cancellation error -- can handle this if you wish
      return false
    }
  }
  // rounds exhausted without authorization
  return false
}

console.log(api)

const fetchWalletSaga = function * (guid, sharedKey, session, password) {
  try {
    console.log('0')
    let wallet = yield call(api.downloadWallet, guid, sharedKey, session, password)
    console.log('1')
    yield put(walletActions.loadWallet(wallet))
    console.log('2')

    yield put(walletActions.requestWalletData(getWalletContext(wallet).toJS()))
    console.log('3')
    yield put(actions.loginSuccess())
  } catch (error) {
    if (prop('authorization_required', error)) {
      let authorized = yield call(pollingSaga, session)
      if (authorized) {
        yield call(fetchWalletSaga, guid, undefined, session, password)
      }
    } else {
      yield put(actions.loginError(error))
    }
  }
}

const login = function * (action) {
  const credentials = action.payload
  // login with shared key
  if (credentials.sharedKey) {
    yield call(fetchWalletSaga, credentials.guid, credentials.sharedKey, undefined, credentials.password)
  } else {
    // if no shared key check for session
    let session = yield select(getSession(credentials.guid))
    session = yield call(api.establishSession, session)  // establishSession logic should not receive existent session as parameter
    yield put(actions.saveSession(assoc(credentials.guid, session, {})))
    yield call(fetchWalletSaga, credentials.guid, undefined, session, credentials.password)
  }
}

export default {
  login: login
}
