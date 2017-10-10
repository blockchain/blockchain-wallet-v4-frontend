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
  const runTask = function * (task, setActionCreator) {
    let result = yield call(compose(taskToPromise, () => task))
    yield put(setActionCreator(result))
  }

  const toggleSecondPassword = function * ({ password }) {
    const wrapper = yield select(prop(walletPath))
    const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(walletPath)))
    if (isEncrypted) {
      const task = Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
      yield call(runTask, task, A.setWrapper)
    } else {
      const task = Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
      yield call(runTask, task, A.setWrapper)
    }
  }

  const createLegacyAddress = function * ({address, password}) {
    const wrapper = yield select(prop(walletPath))
    const a = Address.fromJS(address)
    const addAddress = wallet => Wallet.addAddress(wallet, a, password)
    const task = eitherToTask(Wrapper.traverseWallet(Either.of, addAddress, wrapper))
    yield call(runTask, task, A.setWrapper)
  }

  const createWalletSaga = function * ({ password, email }) {
    const mnemonic = BIP39.generateMnemonic()
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic)
    const register = api.createWallet(email)
    yield call(register, wrapper)
    yield put(A.setWrapper(wrapper))
  }

  const fetchWalletSaga = function * ({ guid, sharedKey, session, password, code }) {
    const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    yield put(A.setWrapper(wrapper))
  }

  const findUsedAccounts = function * ({batch, node, usedAccounts}) {
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
      return yield call(findUsedAccounts, { batch: batch, node: node, usedAccounts: concat(usedAccounts, flags) })
    }
  }

  const restoreWalletSaga = function * ({ mnemonic, email, password, network }) {
    const seed = BIP39.mnemonicToSeed(mnemonic)
    const masterNode = Bitcoin.HDNode.fromSeedBuffer(seed, network)
    const node = masterNode.deriveHardened(44).deriveHardened(0)
    const nAccounts = yield call(findUsedAccounts, {batch: 10, node: node, usedAccounts: []})
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic, undefined, nAccounts)
    const register = api.createWallet(email)
    yield call(register, wrapper)
    yield put(A.setWrapper(wrapper))
  }

  const updatePbkdf2Iterations = function * ({iterations, password}) {
    if (not(is(Number, iterations))) {
      throw new Error('PBKDF2_ITERATIONS_NOT_A_NUMBER')
    } else {
      const wrapper = yield select(prop(walletPath))
      const isEncrypted = yield select(compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet, prop(walletPath)))
      if (isEncrypted) {
        const task = Task.of(wrapper)
                    .chain(Wrapper.traverseWallet(Task.of, Wallet.decrypt(password)))
                    .map(Wrapper.setBothPbkdf2Iterations(iterations))
                    .chain(Wrapper.traverseWallet(Task.of, Wallet.encrypt(password)))
        yield call(runTask, task, A.setWrapper)
      } else {
        const newWrapper = Wrapper.setBothPbkdf2Iterations(iterations, wrapper)
        yield put(A.setWrapper(newWrapper))
      }
    }
  }

  const remindWalletGuidSaga = function * ({ email, code, sessionToken }) {
    const response = yield call(api.remindGuid, email, code, sessionToken)
    const { success, message } = response
    if (!success) { throw new Error(message) }
  }

  return {
    toggleSecondPassword,
    createWalletSaga,
    restoreWalletSaga,
    createLegacyAddress,
    updatePbkdf2Iterations,
    remindWalletGuidSaga,
    fetchWalletSaga
  }
}
