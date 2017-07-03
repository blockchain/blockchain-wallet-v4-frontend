import { takeEvery, call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import { prop, compose } from 'ramda'
import Task from 'data.task'
import Either from 'data.either'
import * as A from './actions'
import * as T from './actionTypes'
import { Wrapper, Wallet, Address } from '../../types'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
const eitherToTask = e => e.fold(Task.rejected, Task.of)

export const walletSaga = ({ api, walletPath } = {}) => {
  // helpers saga
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
      const task = Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
      yield call(runTask, task, A.toggleSecondPasswordError, A.toggleSecondPasswordSuccess)
    } else {
      const task = Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
      yield call(runTask, task, A.toggleSecondPasswordError, A.toggleSecondPasswordSuccess)
    }
  }

  const createAddressSaga = function * (action) {
    const { address, secondPassword } = action.payload
    const newAddress = Address.fromJS(address)
    const wrapper = yield select(prop(walletPath))
    const addNewAddress = wallet => Wallet.addAddress(wallet, newAddress, secondPassword)
    const task = eitherToTask(Wrapper.traverseWallet(Either.of, addNewAddress, wrapper))
    yield call(runTask, task, A.createAddressError, A.createAddressSuccess)
  }

  const walletSignupSaga = function * (action) {
    const label = undefined
    const { password, email } = action.payload
    const mnemonic = BIP39.generateMnemonic()
    try {
      const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
      yield put(A.createWalletSuccess(guid, password, sharedKey, mnemonic, label, email))
    } catch (error) {
      // TODO :: create a file with error keys
      const errorKey = 'API_GENERATE_UUID_FAILED'
      yield put(A.createWalletError(errorKey))
    }
  }

  return function * () {
    yield takeEvery(T.TOGGLE_SECOND_PASSWORD, secondPasswordSaga)
    yield takeEvery(T.CREATE_WALLET, walletSignupSaga)
    yield takeEvery(T.CREATE_ADDRESS, createAddressSaga)
  }
}
