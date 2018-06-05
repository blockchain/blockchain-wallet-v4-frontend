import { call, put, select } from 'redux-saga/effects'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import { prop, compose, endsWith, repeat, range, map, propSatisfies,
  length, dropLastWhile, not, concat, propEq, is, find, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import Task from 'data.task'
import * as A from './actions'
import * as S from './selectors'
import { fetchData } from '../data/bitcoin/actions'

import { Wrapper, Wallet } from '../../types'
import { generateMnemonic } from '../../walletCrypto'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
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

  const importLegacyAddress = function * ({ key, network, password, bipPass }) {
    const wallet = yield select(S.getWallet)
    const wrapper = yield select(S.getWrapper)
    const walletT = Wallet.importLegacyAddress(wallet, key, Date.now(), password, bipPass, { network, api })
    const wrapperT = walletT.map(wallet => set(Wrapper.wallet, wallet, wrapper))
    yield call(runTask, wrapperT, A.setWrapper)
  }

  const newHDAccount = function * ({label, password}) {
    let wrapper = yield select(S.getWrapper)
    let nextWrapper = Wrapper.traverseWallet(Task.of, Wallet.newHDAccount(label, password), wrapper)
    yield call(runTask, nextWrapper, A.setWrapper)
    yield refetchContextData()
  }

  const createWalletSaga = function * ({ password, email }) {
    const mnemonic = yield call(generateMnemonic, api)
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(guid, password, sharedKey, mnemonic)
    yield call(api.createWallet, email, wrapper)
    yield put(A.refreshWrapper(wrapper))
  }

  const fetchWalletSaga = function * ({ guid, sharedKey, session, password, code }) {
    const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    yield put(A.setWrapper(wrapper))
  }

  const upgradeToHd = function * ({ password }) {
    let wrapper = yield select(S.getWrapper)
    let hdwallets = compose(i => i.toJS(), Wallet.selectHdWallets, Wrapper.selectWallet)(wrapper)

    if (isEmpty(hdwallets)) {
      let mnemonic = yield call(generateMnemonic, api)
      let upgradeWallet = Wallet.upgradeToHd(mnemonic, 'My Bitcoin Wallet', password)
      let nextWrapper = Wrapper.traverseWallet(Task.of, upgradeWallet, wrapper)
      yield call(runTask, nextWrapper, A.setWrapper)
    } else {
      throw new Error('Already an HD wallet')
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

  const refetchContextData = function * () {
    yield put(fetchData())
  }

  return {
    toggleSecondPassword,
    createWalletSaga,
    restoreWalletSaga,
    importLegacyAddress,
    newHDAccount,
    updatePbkdf2Iterations,
    remindWalletGuidSaga,
    fetchWalletSaga,
    upgradeToHd,
    resetWallet2fa,
    refetchContextData
  }
}
