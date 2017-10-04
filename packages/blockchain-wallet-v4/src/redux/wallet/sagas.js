import { delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import { prop, compose, endsWith, repeat, range, map, propSatisfies,
         dropLastWhile, not, length, concat, propEq, is, find } from 'ramda'
import Task from 'data.task'
import Either from 'data.either'
import * as A from './actions'
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

  const toggleSecondPasswordSaga = function * (action) {
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

  const createWalletSaga = function * (action) {
    const { password, email } = action.payload
    const mnemonic = BIP39.generateMnemonic()
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic)
    const register = api.createWallet(email)
    yield call(register, wrapper)
    yield put(A.setWrapper(wrapper))
  }



  const fetchWalletSaga = function * (guid, sharedKey, session, password, code) {
    const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    yield put(A.setWrapper(wrapper))
  }

  const findUsedAccounts = function * (batch, node, usedAccounts) {
    if (endsWith(repeat(false, 5), usedAccounts)) {
      const n = length(dropLastWhile(not, usedAccounts))
      return n < 1 ? 1 : n
    } else {
      const l = length(usedAccounts)
      const getxpub = i => node.deriveHardened(i).neutered().toBase58()
      const isUsed = a => propSatisfies(n => n > 0, 'n_tx', a)
      const xpubs = map(getxpub, range(l, l + batch))
      const result = yield call(api.fetchBlockchainData, xpubs, {n: 1, offset: 0, onlyShow: ''})
      const search = xpub => find(propEq('address', xpub))
      const accounts = map(xpub => search(xpub)(prop('addresses', result)), xpubs)
      const flags = map(isUsed, accounts)
      return yield call(findUsedAccounts, batch, node, concat(usedAccounts, flags))
    }
  }

  const restoreWalletSaga = function * (action) {
    const { mnemonic, email, password, network } = action.payload
    const seed = BIP39.mnemonicToSeed(mnemonic)
    const masterNode = Bitcoin.HDNode.fromSeedBuffer(seed, network)
    const node = masterNode.deriveHardened(44).deriveHardened(0)
    const nAccounts = yield call(findUsedAccounts, 10, node, [])
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic, undefined, nAccounts)
    const register = api.createWallet(email)
    yield call(register, wrapper)
    yield put(A.setWrapper(wrapper))
  }

  const setPbkdf2IterationsSaga = function * (action) {
    const { iterations, password } = action.payload
    if (not(is(Number, iterations))) {
      yield put(A.setPbkdf2IterationsError('PBKDF2_ITERATIONS_NOT_A_NUMBER'))
    } else {
      const wrapper = yield select(prop(walletPath))
      const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(walletPath)))
      if (isEncrypted) {
        const task = Task.of(wrapper)
                    .chain(Wrapper.traverseWallet(Task.of, Wallet.decrypt(password)))
                    .map(Wrapper.setBothPbkdf2Iterations(iterations))
                    .chain(Wrapper.traverseWallet(Task.of, Wallet.encrypt(password)))
        yield call(runTask, task, A.setPbkdf2IterationsError, A.setPbkdf2IterationsSuccess)
      } else {
        const newWrapper = Wrapper.setBothPbkdf2Iterations(iterations, wrapper)
        yield put(A.setPbkdf2IterationsSuccess(newWrapper))
      }
    }
  }
  const changeSecondPasswordSaga = function * (action) {
    const { oldPassword, newPassword } = action.payload
    const wrapper = yield select(prop(walletPath))
    const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(walletPath)))
    if (isEncrypted) {
      const task = Task.of(wrapper)
                  .chain(Wrapper.traverseWallet(Task.of, Wallet.decrypt(oldPassword)))
                  .chain(Wrapper.traverseWallet(Task.of, Wallet.encrypt(newPassword)))
      yield call(runTask, task, A.changeSecondPasswordError, A.changeSecondPasswordSuccess)
    } else {
      yield put(A.changeSecondPasswordError('SECOND_PASSWORD_WAS_NOT_ACTIVE'))
    }
  }

  const remindWalletGuidSaga = function * (action) {
    const { email, code, sessionToken } = action.payload
    try {
      const response = yield call(api.remindGuid, email, code, sessionToken)
      const { success, message } = response
      if (success) {
        yield put(A.remindWalletGuidSuccess(message))
      } else {
        yield put(A.remindWalletGuidError(message))
      }
    } catch (error) {
      yield put(A.remindWalletGuidError(error))
    }
  }

  // return function * () {
  //   yield takeEvery(T.TOGGLE_SECOND_PASSWORD, toggleSecondPasswordSaga)
  //   yield takeEvery(T.CHANGE_SECOND_PASSWORD, changeSecondPasswordSaga)
  //   yield takeEvery(T.CREATE_WALLET, createWalletSaga)
  //   yield takeEvery(T.RESTORE_WALLET, restoreWalletSaga)
  //   yield takeEvery(T.CREATE_LEGACY_ADDRESS, createAddressSaga)
  //   yield takeEvery(T.SET_PBKDF2_ITERATIONS, setPbkdf2IterationsSaga)
  //   yield takeEvery(T.REMIND_WALLET_GUID, remindWalletGuid)
  // }
  return {
    toggleSecondPasswordSaga,
    changeSecondPasswordSaga,
    createWalletSaga,
    restoreWalletSaga,
    createAddressSaga,
    setPbkdf2IterationsSaga,
    remindWalletGuidSaga,
    fetchWalletSaga
  }
}
