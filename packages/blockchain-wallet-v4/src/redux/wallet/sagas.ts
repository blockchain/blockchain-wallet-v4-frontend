import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import {
  compose,
  concat,
  dropLastWhile,
  endsWith,
  find,
  is,
  isEmpty,
  length,
  map,
  not,
  prop,
  propEq,
  propSatisfies,
  range,
  repeat
} from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { HDAccount, KVStoreEntry, Wallet, Wrapper } from '../../types'
import { callTask } from '../../utils/functional'
import { generateMnemonic } from '../../walletCrypto'
import * as A from '../actions'
import { fetchData } from '../data/btc/actions'
import { derivationMap, WALLET_CREDENTIALS } from '../kvStore/config'
import * as S from './selectors'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks }) => {
  const runTask = function*(task, setActionCreator) {
    let result = yield call(compose(taskToPromise, () => task))
    yield put(setActionCreator(result))
  }

  const toggleSecondPassword = function*({ password }) {
    const wrapper = yield select(S.getWrapper)
    const isEncrypted = yield select(S.isSecondPasswordOn)
    if (isEncrypted) {
      const task = Wrapper.traverseWallet(
        Task.of,
        Wallet.decrypt(password),
        wrapper
      )
      yield call(runTask, task, A.wallet.setWrapper)
    } else {
      const task = Wrapper.traverseWallet(
        Task.of,
        Wallet.encrypt(password),
        wrapper
      )
      yield call(runTask, task, A.wallet.setWrapper)
    }
  }

  const importLegacyAddress = function*({
    bipPass,
    key,
    label,
    network,
    password
  }) {
    const wallet = yield select(S.getWallet)
    const wrapper = yield select(S.getWrapper)
    const walletT = Wallet.importLegacyAddress(
      wallet,
      key,
      Date.now(),
      password,
      bipPass,
      label,
      { network, api }
    )
    const wrapperT = walletT.map(wallet => set(Wrapper.wallet, wallet, wrapper))
    yield call(runTask, wrapperT, A.wallet.setWrapper)
  }

  const newHDAccount = function*({ label, password }) {
    let wrapper = yield select(S.getWrapper)
    let nextWrapper = Wrapper.traverseWallet(
      Task.of,
      Wallet.newHDAccount(label, password, networks.btc),
      wrapper
    )
    yield call(runTask, nextWrapper, A.wallet.setWrapper)
    yield refetchContextData()
  }

  const createWalletSaga = function*({ email, language, password }) {
    const mnemonic = yield call(generateMnemonic, api)
    const [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    const wrapper = Wrapper.createNew(
      guid,
      password,
      sharedKey,
      mnemonic,
      language,
      undefined,
      undefined,
      networks.btc
    )
    yield call(api.createWallet, email, wrapper)
    yield put(A.wallet.refreshWrapper(wrapper))
  }

  const fetchWalletSaga = function*({
    code,
    guid,
    password,
    session,
    sharedKey
  }) {
    const wrapper = yield call(
      api.fetchWallet,
      guid,
      sharedKey,
      session,
      password,
      code
    )
    yield put(A.wallet.setWrapper(wrapper))
  }

  const upgradeToHd = function*({ password }) {
    let wrapper = yield select(S.getWrapper)
    let hdwallets = compose(
      // @ts-ignore
      i => i.toJS(),
      Wallet.selectHdWallets,
      Wrapper.selectWallet
      // @ts-ignore
    )(wrapper)

    if (isEmpty(hdwallets)) {
      let mnemonic = yield call(generateMnemonic, api)
      let upgradeWallet = Wallet.upgradeToHd(
        mnemonic,
        'My Bitcoin Wallet',
        password,
        networks.btc
      )
      let nextWrapper = Wrapper.traverseWallet(Task.of, upgradeWallet, wrapper)
      yield call(runTask, nextWrapper, A.wallet.setWrapper)
    } else {
      throw new Error('Already an HD wallet')
    }
  }

  const findUsedAccounts = function*({ batch, node, usedAccounts }) {
    if (endsWith(repeat(false, 5), usedAccounts)) {
      const n = length(dropLastWhile(not, usedAccounts))
      return n < 1 ? 1 : n
    } else {
      const l = length(usedAccounts)
      const getxpub = i =>
        node
          .deriveHardened(i)
          .neutered()
          .toBase58()
      // @ts-ignore
      const isUsed = a => propSatisfies(n => n > 0, 'n_tx', a)
      const xpubs = map(getxpub, range(l, l + batch))
      const result = yield call(api.fetchBlockchainData, xpubs, {
        n: 1,
        offset: 0,
        onlyShow: ''
      })
      const search = xpub => find(propEq('address', xpub))
      const accounts = map(
        xpub => search(xpub)(prop('addresses', result)),
        xpubs
      )
      const flags = map(isUsed, accounts)
      return yield call(findUsedAccounts, {
        batch: batch,
        node: node,
        usedAccounts: concat(usedAccounts, flags)
      })
    }
  }

  const restoreWalletCredentials = function*(mnemonic) {
    const seedHex = BIP39.mnemonicToEntropy(mnemonic)
    const getMetadataNode = compose(
      KVStoreEntry.deriveMetadataNode,
      KVStoreEntry.getMasterHDNode(networks.btc)
    )
    // @ts-ignore
    const metadataNode = getMetadataNode(seedHex)
    // @ts-ignore
    const mxpriv = metadataNode.toBase58()
    const typeId = derivationMap[WALLET_CREDENTIALS]
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
    const newkv = yield callTask(api.fetchKVStore(kv))
    return newkv.value
  }

  const restoreWalletFromMetadata = function*(creds, newPassword) {
    if (!creds) {
      return false
    }

    try {
      // Let's update the password and upload the new encrypted payload
      const wallet = yield call(
        api.fetchWalletWithSharedKey,
        creds.guid,
        creds.sharedKey,
        creds.password
      )
      const wrapperT = set(Wrapper.password, newPassword, wallet)
      try {
        yield call(api.saveWallet, wrapperT)
      } catch (e) {
        throw e
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error('Unable to restore wallet from metadata', e)
      return false
    }
  }

  const restoreWalletSaga = function*({ email, language, mnemonic, password }) {
    // TODO check wallet credentials after FirstStep in recovery flow to bypass the email field
    const creds = yield call(restoreWalletCredentials, mnemonic)
    const recovered = yield call(restoreWalletFromMetadata, creds, password)

    const seed = BIP39.mnemonicToSeed(mnemonic)
    const masterNode = Bitcoin.HDNode.fromSeedBuffer(seed, networks.btc)
    const node = masterNode.deriveHardened(44).deriveHardened(0)
    const nAccounts = yield call(findUsedAccounts, {
      batch: 10,
      node: node,
      usedAccounts: []
    })
    let [guid, sharedKey] = yield call(api.generateUUIDs, 2)
    if (recovered) {
      guid = creds.guid
      sharedKey = creds.sharedKey
    }
    const wrapper = Wrapper.createNew(
      guid,
      password,
      sharedKey,
      mnemonic,
      language,
      undefined,
      nAccounts
    )
    if (!recovered) {
      yield call(api.createWallet, email, wrapper)
    }
    yield put(A.wallet.refreshWrapper(wrapper))
  }

  const updatePbkdf2Iterations = function*({ iterations, password }) {
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
        yield call(runTask, task, A.wallet.setWrapper)
      } else {
        const newWrapper = Wrapper.setBothPbkdf2Iterations(iterations, wrapper)
        yield put(A.wallet.setWrapper(newWrapper))
      }
    }
  }

  const remindWalletGuidSaga = function*({ code, email, sessionToken }) {
    yield call(api.remindGuid, email, code, sessionToken)
  }

  const resetWallet2fa = function*({
    code,
    email,
    guid,
    message,
    newEmail,
    secretPhrase,
    sessionToken
  }) {
    return yield call(
      api.reset2fa,
      guid,
      email,
      newEmail,
      secretPhrase,
      message,
      code,
      sessionToken
    )
  }

  const resendSmsLoginCode = function*({ guid, sessionToken }) {
    return yield call(api.resendSmsLoginCode, guid, sessionToken)
  }

  const refetchContextData = function*() {
    yield put(fetchData())
  }

  const setHDAddressLabel = function*({ payload }) {
    const wallet = yield select(S.getWallet)
    const accounts = Wallet.selectHDAccounts(wallet)
    const receiveAddress = HDAccount.getReceiveAddress(
      accounts.get(payload.accountIdx),
      payload.addressIdx,
      networks.btc
    )
    yield put(A.kvStore.btc.addAddressLabel(receiveAddress, payload.label))
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
    refetchContextData,
    resendSmsLoginCode,
    setHDAddressLabel
  }
}
