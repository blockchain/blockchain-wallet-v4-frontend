// -- EXPOSE AUTHENTICATION SAGAS -- //
import { delay } from 'redux-saga'
import { takeLatest, takeEvery, call, put, select, take, cancel, cancelled, fork, all } from 'redux-saga/effects'
import { prop, assoc } from 'ramda'
import { api } from '../../services/ApiService'
import { core } from '../sagas.js'
import { Types } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as actionTypes from '../actionTypes.js'
import * as selectors from '../selectors.js'

const manageWalletData = function * () {
  const bitcoinContext = yield select(selectors.core.wallet.getWalletContext)
  const blockchainData = yield call(api.fetchBlockchainData, bitcoinContext)
}

const loginRoutineSaga = function * () {
  try {
    yield call(manageWalletData)
  } catch (e) {
    console.log(e)
  }
}

const getWalletPayload = function * (action) {
  const { guid, sharedKey, password, code } = action.payload
  try {
    let session = void 0
    let code = void 0
    yield call(core.wallet.fetchWalletSaga, { guid, sharedKey, session, password, code })
    yield call(loginRoutineSaga)
  } catch (e) {
    throw new Error(e)
  }
  //   let payload = JSON.stringify(Types.Wrapper.toJS(wallet), null, 2)
  //   console.log(payload)
  //   put(actions.auth.storeWalletPayload(payload))
}

const login = function * (action) {
  yield takeLatest(AT.LOGIN, getWalletPayload)
}

export default login
