
import { takeEvery, call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import { prop, compose } from 'ramda'
import Task from 'data.task'

// import { getTransactions } from './selectors'
import * as A from './actions'
import { Wrapper, Wallet } from '../types'

// api should be promified api (no task for saga)
export const rootSaga = ({ dpath, wpath, api } = {}) => {
  // this should return an object with all the sagas and the api in the clojure
  // so you can decide which sagas you want to run
  const walletDataLoadSaga = function * (action) {
    try {
      console.log(A)
      const context = action.payload
      // we must handle api errors here
      const data = yield call(api.fetchBlockchainData, context, { n: 50 })
      yield put(A.info.loadInfoData(data.wallet))
      yield put(A.latestBlock.loadLatestBlockData(data.info.latest_block))
      yield put(A.addresses.loadAddressesData(data.addresses))
      yield put(A.transactions.loadContextTxs(data.txs))
    } catch (error) {
      // probably there is no context (blank wallet)
    }
  }

  // const dispatchSaga = (actionCreator) => {
  //   console.log('dispatchSagaCreator')
  //   const saga = function * (data) {
  //     console.log('saga dispatcher')
  //     yield put(actionCreator(data))
  //   }
  //   console.log(saga)
  //   return saga
  // }

  const dispatchSaga = actionCreator => data => {
    console.log('dispatching action: ')
    console.log(actionCreator(data))
  }

  const secondPasswordSaga = function * (action) {
    const password = action.payload
    const wrapper = yield select(prop(wpath))
    const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(wpath)))
    if (isEncrypted) {
      Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
             .fork(dispatchSaga(A.common.error), dispatchSaga(A.wallet.secondPasswordOff))
    } else {
      Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
             .fork(dispatchSaga(A.common.error), dispatchSaga(A.wallet.secondPasswordOn))
    }
  }

  // const txsLoadRequestSaga = function * (action) {
  //   // NOTE: context must be a single address, for now
  //   const context = Array.isArray(action.payload) ? action.payload[0] : action.payload
  //   const currentTxs = yield select(getTransactions(dpath)(context))
  //   // we can handle api errors here
  //   const data = yield call(api.fetchBlockchainData, context, { n: 50, offset: currentTxs.size })
  //   yield put(A.loadContextTxs(data))
  // }

  // const walletSignupSaga = function * (action) {
  //   const { password, email } = action.payload
  //   // TODO :: control this api failure
  //   const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
  //   const mnemonic = BIP39.generateMnemonic()
  //   yield put(A.setNewWallet({guid, sharedKey, mnemonic, password, email}))
  //   yield put(A.newWalletSuccess())
  // }

  return function * () {
    yield takeEvery(A.common.WALLET_DATA_REQUEST, walletDataLoadSaga)
    yield takeEvery(A.wallet.REQUEST_SECOND_PASSWORD_TOGGLE, secondPasswordSaga)
    // yield takeEvery(A.TXS_LOAD_REQUEST, txsLoadRequestSaga)
    // yield takeEvery(A.WALLET_NEW, walletSignupSaga)
  }
}
