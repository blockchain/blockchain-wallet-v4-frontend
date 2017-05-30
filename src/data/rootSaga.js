import {takeEvery, takeLatest} from 'redux-saga'
import { fork } from 'redux-saga/effects'

import * as types from './actionTypes'
import settings from 'config'
import { api } from 'services/walletApi.js'

import * as WalletSagas from 'dream-wallet/lib/sagas'
import authSagas from './Auth/sagas.js'
import activitySagas from './Activity/sagas.js'

const dpath = settings.BLOCKCHAIN_DATA_PATH
const wpath = settings.WALLET_IMMUTABLE_PATH

function * sagas () {
  yield [
    // here you can put an array of sagas in forks
    fork(WalletSagas.rootSaga({api, dpath, wpath}))
  ]
  yield takeEvery(types.LOGIN_START, authSagas.login)
  yield takeLatest(types.FETCH_ACTIVITIES, activitySagas.fetchActivities)
}

export default sagas
