import { takeEvery, call, put, select, fork } from 'redux-saga/effects'
import BIP39 from 'bip39'
import { prop, compose } from 'ramda'
import Task from 'data.task'
// import { getTransactions } from './selectors'
import * as A from './actions'
import * as T from './actionTypes'
import { Wrapper, Wallet } from '../types'

import { ratesSaga } from './data/Rates/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { transactionsSaga } from './data/Transactions/sagas.js'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const rootSaga = ({ api, dataPath, walletPath, settingsPath } = {}) => {
  // this should return an object with all the sagas and the api in the clojure
  // so you can decide which sagas you want to run
  const walletDataLoadSaga = function * (action) {
    try {
      const context = action.payload
      // we must handle api errors here
      const data = yield call(api.fetchBlockchainData, context, { n: 1 })
      yield put(A.addresses.loadAddressesData(data.addresses))
      yield put(A.info.loadInfoData(data.wallet))
      yield put(A.latestBlock.loadLatestBlockData(data.info.latest_block))
      // yield put(A.transactions.loadContextTxs(data.txs))
    } catch (error) {
      // probably there is no context (blank wallet)
    }
  }

  const runTask = function * (task, failureAction, successAction) {
    try {
      let result = yield call(compose(taskToPromise, () => task))
      yield put(successAction(result))
    } catch (error) {
      yield put(failureAction(error.message))
    }
  }

  const secondPasswordSaga = function * (action) {
    const password = action.payload
    const wrapper = yield select(prop(walletPath))
    const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(walletPath)))
    if (isEncrypted) {
      const t = Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
      yield call(runTask, t, A.common.error, A.wallet.secondPasswordOff)
    } else {
      const t = Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
      yield call(runTask, t, A.common.error, A.wallet.secondPasswordOn)
    }
  }

  const walletSignupSaga = function * (action) {
    const label = undefined
    const { password, email } = action.payload
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const mnemonic = BIP39.generateMnemonic()
    yield put(A.wallet.setNewWallet(guid, password, sharedKey, mnemonic, label))
    yield put(A.wallet.newWalletSuccess(email))
  }

  return function * () {
    yield [
      // here you can put an array of sagas in forks
      fork(ratesSaga({api})),
      fork(settingsSaga({api})),
      fork(transactionsSaga({api, walletPath, dataPath}))
    ]
    yield takeEvery(T.common.WALLET_DATA_REQUEST, walletDataLoadSaga)
    yield takeEvery(T.wallet.REQUEST_SECOND_PASSWORD_TOGGLE, secondPasswordSaga)
    yield takeEvery(T.wallet.WALLET_NEW, walletSignupSaga)
  }
}
