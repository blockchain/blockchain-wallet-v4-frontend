import { delay } from 'redux-saga'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { prop, assoc, isNil } from 'ramda'
import Either from 'data.either'

import * as AT from './actionTypes'
import { actionTypes, actions, selectors } from 'data'
import { api } from 'services/ApiService'

let safeParse = Either.try(JSON.parse)

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
    yield put(actions.core.wallet.setWrapper(wrapper))
    const context = yield select(selectors.core.wallet.getWalletContext)
    yield put(actions.core.common.fetchBlockchainData(context))
    const sk = yield select(selectors.core.wallet.getSharedKey)
    yield put(actions.core.settings.fetchSettings({guid, sharedKey: sk}))
    yield put(actions.core.webSocket.startSocket())
    yield put(actions.auth.loginSuccess())
    yield put(actions.auth.logoutStartTimer())
    yield put(push('/wallet'))
    yield put(actions.alerts.displaySuccess('Logged in successfully'))
  } catch (error) {
    let initialError = safeParse(error).map(prop('initial_error'))
    let authRequired = safeParse(error).map(prop('authorization_required'))

    if (authRequired.isRight && authRequired.value) {
      yield put(actions.alerts.displayInfo('Authorization required, check your inbox'))
      let authorized = yield call(pollingSaga, session)
      if (authorized) {
        yield call(fetchWalletSaga, guid, undefined, session, password)
      }
    } else if (initialError.isRight && initialError.value) {
      yield put(actions.alerts.displayError(initialError.value))
    } else {
      yield put(actions.alerts.displayError(error.message || 'Error logging into your wallet'))
      yield put(actions.log.recordLog({ type: 'ERROR', message: error.message }))
    }
  }
}

const login = function * (action) {
  const credentials = action.payload
  // login with shared key
  if (credentials.sharedKey) {
    yield call(fetchWalletSaga, credentials.guid, credentials.sharedKey, undefined, credentials.password)
  } else {
    try {
      let session = yield select(selectors.auth.getSession(credentials.guid))
      session = yield call(api.establishSession, session)  // establishSession logic should not receive existent session as parameter
      yield put(actions.auth.saveSession(assoc(credentials.guid, session, {})))
      yield call(fetchWalletSaga, credentials.guid, undefined, session, credentials.password)
    } catch (e) {
      yield put(actions.alerts.displayError('Error establishing the session'))
    }
  }
}

const trezor = function * (action) {
  const context = yield select(selectors.core.wallet.getWalletContext)
  yield put(actions.core.common.fetchBlockchainData(context))
  yield put(actions.core.webSocket.startSocket())
  yield put(actions.auth.loginSuccess())
  yield put(push('/wallet'))
  yield put(actions.alerts.displaySuccess('Logged in successfully'))
}

const trezorFailed = function * (action) {
  yield put(actions.alerts.displayError('Trezor connection failed'))
}

const logout = function * () {
  // yield put(actions.core.webSocket.stopSocket())
  window.location.reload(true)
}

// =============================================================================
// ============================ MobileLogin modal = =============================
// =============================================================================

const mobileLoginSuccess = function * (action) {
  const { payload } = action
  const { data } = payload

  if (data) {
    const [version, guid, encrypted] = data.split('|');
    const passphrase = yield call(api.getPairingPassword, guid)
    console.log(passphrase)
    // const guid = decodedData.guid
    // const password = decodedData.password
    // const sharedKey = decodedData.sharedKey

    // console.log(guid)
    // console.log(password)
    // console.log(sharedKey)

    if (isNil(guid)) {
      yield put(actions.alerts.displayError('An error occured when capturing the QRCode.'))
      return
    }

    // fetchWalletSaga(guid, sharedKey, undefined, password)

    yield put(actions.modals.closeModal())
  }
}

const mobileLoginError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
  yield put(actions.modals.closeModal())
}

function * sagas () {
  yield takeEvery(AT.MOBILE_LOGIN_SUCCESS, mobileLoginSuccess)
  yield takeEvery(AT.MOBILE_LOGIN_ERROR, mobileLoginError)
  yield takeEvery(AT.LOGIN_START, login)
  yield takeEvery(AT.LOGOUT_START, logout)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_SUCCESS, trezor)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_ERROR, trezorFailed)
}

export default sagas
