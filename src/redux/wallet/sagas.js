import { takeEvery, call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import { prop, compose, endsWith, repeat, range, map, propSatisfies,
         dropLastWhile, not, length, concat } from 'ramda'
import Task from 'data.task'
import Either from 'data.either'
import * as A from './actions'
import * as T from './actionTypes'
import { Wrapper, Wallet, Address } from '../../types'
import * as Trezor from '../../Trezor'

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

  const createWalletSaga = function * (action) {
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

  const findUsedAccounts = function * (batch, node, usedAccounts) {
    if (endsWith(repeat(false, 5), usedAccounts)) {
      return length(dropLastWhile(not, usedAccounts))
    } else {
      const l = length(usedAccounts)
      const getxpub = i => node.deriveHardened(i).neutered().toBase58()
      const isUsed = a => propSatisfies(n => n > 0, 'n_tx', a)
      const xpubs = map(getxpub, range(l, l + batch))
      const result = yield call(api.fetchBlockchainData, xpubs, {n: 1, offset: 0, onlyShow: ''})
      const accounts = map(isUsed, prop('addresses', result))
      return yield call(findUsedAccounts, batch, node, concat(usedAccounts, accounts))
    }
  }

  const restoreWalletSaga = function * (action) {
    const { mnemonic, email, password } = action.payload
    if (!BIP39.validateMnemonic(mnemonic)) {
      yield put(A.restoreWalletError('INVALID_MNEMONIC'))
    } else {
      // we might want to make that coin generic
      const seed = BIP39.mnemonicToSeed(mnemonic)
      const masterNode = Bitcoin.HDNode.fromSeedBuffer(seed)
      const node = masterNode.deriveHardened(44).deriveHardened(0)
      try {
        const nAccounts = yield call(findUsedAccounts, 10, node, [])
        const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
        const label = undefined
        yield put(A.restoreWalletSuccess(guid, password, sharedKey, mnemonic, label, email, nAccounts))
      } catch (e) {
        yield put(A.restoreWalletError('ERROR_DISCOVERING_ACCOUNTS'))
      }
    }
  }

  const createTrezorWalletSaga = function * (action) {
    const accountIndex = action.payload || 0
    try {
      const task = Trezor.getXPub(`m/44'/0'/${accountIndex}'`)
      const xpub = yield call(compose(taskToPromise, () => task))
      const wrapper = Wrapper.createNewReadOnly(xpub)
      yield put(A.createTrezorWalletSuccess(wrapper))
    } catch (e) {
      yield put(A.createTrezorWalletError('UNABLE_TO_CONNECT'))
    }
  }

  return function * () {
    yield takeEvery(T.TOGGLE_SECOND_PASSWORD, secondPasswordSaga)
    yield takeEvery(T.CREATE_WALLET, createWalletSaga)
    yield takeEvery(T.RESTORE_WALLET, restoreWalletSaga)
    yield takeEvery(T.CREATE_TREZOR_WALLET, createTrezorWalletSaga)
    yield takeEvery(T.CREATE_LEGACY_ADDRESS, createAddressSaga)
  }
}
