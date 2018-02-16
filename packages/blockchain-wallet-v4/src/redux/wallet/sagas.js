import { call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import { prop, compose, endsWith, repeat, range, map, propSatisfies,
         length, dropLastWhile, not, concat, propEq, is, find, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import Task from 'data.task'
import Either from 'data.either'
import * as A from './actions'
import * as S from './selectors'
import { fetchData } from '../data/bitcoin/actions'

import { Wrapper, Wallet, Address, AddressMap, HDAccount, HDWallet, HDWalletList } from '../../types'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
const eitherToTask = e => e.fold(Task.rejected, Task.of)

export const walletSaga = ({ api } = {}) => {
  const runTask = function * (task, setActionCreator) {
    let result = yield call(compose(taskToPromise, () => task))
    yield put(setActionCreator(result))
  }

  const toggleSecondPassword = function * ({ password }) {
    const wrapper = yield select(S.getWrapper)
    const isEncrypted = yield select(S.isSecondPasswordOn)
    if (isEncrypted) {
      const task = Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
      yield call(runTask, task, A.setWrapper)
    } else {
      const task = Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
      yield call(runTask, task, A.setWrapper)
    }
  }

  const setArchivedAddress = function * ({ address }) {
    const wrapper = yield select(S.getWrapper)
    const wallet = yield select(S.getWallet)
    const addr = compose(AddressMap.selectAddress(address), Wallet.selectAddresses)(wallet)
    const archiveAddress = wallet => Wallet.archiveAddress(addr, wallet)
    const task = eitherToTask(Wrapper.traverseWallet(Either.of, archiveAddress, wrapper))
    yield call(runTask, task, A.refreshWrapper)
    const walletContext = yield select(S.getWalletContext)
    yield put(fetchData(walletContext))
  }

  const createLegacyAddress = function * ({address, password}) {
    const wrapper = yield select(S.getWrapper)
    const a = Address.fromJS(address)
    const addAddress = wallet => Wallet.addAddress(wallet, a, password)
    const task = eitherToTask(Wrapper.traverseWallet(Either.of, addAddress, wrapper))
    yield call(runTask, task, A.setWrapper)
    const walletContext = yield select(S.getWalletContext)
    yield put(fetchData(walletContext))
  }

  const addWallet = function * ({ label, password }) {
    try {
      const wrapper = yield select(S.getWrapper)
      const hdwallet = yield select(S.getDefaultHDWallet)
      const getMnemonic = state => S.getMnemonic(state, password)
      const eitherMnemonic = yield select(getMnemonic)
      const hdwallets = compose(i => i.toJS(), Wallet.selectHdWallets, Wrapper.selectWallet)(wrapper)
      const i = hdwallets[0].accounts.length
      if (eitherMnemonic.isRight) {
        const mnemonic = eitherMnemonic.value
        const account = i => HDAccount.js(label, HDAccount.fromMnemonic(mnemonic, undefined, label)(i), undefined)
        const addHDAccount = hdw => HDWallet.addHDAccount(hdw, account(i), i)
        const wallet = addHDAccount(hdwallet)
        const newWrapper = set(compose(Wrapper.wallet, Wallet.hdWallets), HDWalletList.fromJS([wallet.value]), wrapper)
        yield put(A.refreshWrapper(newWrapper))
      } else {
        throw new Error('Could not get mnemonic.')
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  const createWalletSaga = function * ({ password, email }) {
    const mnemonic = BIP39.generateMnemonic()
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic)
    yield call(api.createWallet, email, wrapper)
    yield put(A.refreshWrapper(wrapper))
  }

  const fetchWalletSaga = function * ({ guid, sharedKey, session, password, code }) {
    const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    const hdwallets = compose(i => i.toJS(), Wallet.selectHdWallets, Wrapper.selectWallet)(wrapper)
    if (isEmpty(hdwallets)) {
      // TODO :: if second password on should add an encrypted hdwallet (require ask second password)
      const mnemonic = BIP39.generateMnemonic()
      const hdwalletList = HDWalletList.createNew(guid, password, sharedKey, mnemonic)
      const newWrapper = set(compose(Wrapper.wallet, Wallet.hdWallets), hdwalletList, wrapper)
      yield put(A.setWrapper(newWrapper))
      return true // upgrade need
    } else {
      yield put(A.setWrapper(wrapper))
      return false
    }
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
    yield call(api.createWallet, email, wrapper)
    yield put(A.refreshWrapper(wrapper))
  }

  const updatePbkdf2Iterations = function * ({iterations, password}) {
    if (not(is(Number, iterations))) {
      throw new Error('PBKDF2_ITERATIONS_NOT_A_NUMBER')
    } else {
      const wrapper = yield select(S.getWrapper)
      const isEncrypted = yield select(S.isSecondPasswordOn)
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

  const resetWallet2fa = function * ({ guid, email, newEmail, secretPhrase, message, code, sessionToken }) {
    return yield call(api.reset2fa, guid, email, newEmail, secretPhrase, message, code, sessionToken)
  }

  return {
    addWallet,
    toggleSecondPassword,
    createWalletSaga,
    restoreWalletSaga,
    createLegacyAddress,
    setArchivedAddress,
    updatePbkdf2Iterations,
    remindWalletGuidSaga,
    fetchWalletSaga,
    resetWallet2fa
  }
}
