import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import {
  add,
  any,
  compose,
  curry,
  find,
  findLastIndex,
  head,
  is,
  isEmpty,
  last,
  map,
  not,
  prop,
  propEq,
  propSatisfies,
  range,
  splitAt,
  startsWith
} from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { HDAccount, KVStoreEntry, Wallet, Wrapper } from '../../types'
import { callTask } from '../../utils/functional'
import { generateMnemonic } from '../../walletCrypto'
import * as A from '../actions'
import { fetchData } from '../data/btc/actions'
import { derivationMap, WALLET_CREDENTIALS } from '../kvStore/config'
import * as SS from '../selectors'
import * as S from './selectors'

const BTC_ACCT_NAME = 'Private Key Wallet'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks }) => {
  const runTask = function* (task, setActionCreator) {
    const result = yield call(compose(taskToPromise, () => task))
    yield put(setActionCreator(result))
  }

  const toggleSecondPassword = function* ({ password }) {
    const wrapper = yield select(S.getWrapper)
    const isEncrypted = yield select(S.isSecondPasswordOn)
    if (isEncrypted) {
      const task = Wrapper.traverseWallet(Task.of, Wallet.decrypt(password), wrapper)
      yield call(runTask, task, A.wallet.setWrapper)
    } else {
      const task = Wrapper.traverseWallet(Task.of, Wallet.encrypt(password), wrapper)
      yield call(runTask, task, A.wallet.setWrapper)
    }
  }

  const importLegacyAddress = function* ({ bipPass, key, label, network, password }) {
    const wallet = yield select(S.getWallet)
    const wrapper = yield select(S.getWrapper)
    const walletT = Wallet.importLegacyAddress(wallet, key, Date.now(), password, bipPass, label, {
      api,
      network
    })
    const wrapperT = walletT.map((wallet) => set(Wrapper.wallet, wallet, wrapper))
    yield call(runTask, wrapperT, A.wallet.setWrapper)
  }

  const refetchContextData = function* () {
    yield put(fetchData())
  }

  const newHDAccount = function* ({ label, password }) {
    const wrapper = yield select(S.getWrapper)
    const nextWrapper = Wrapper.traverseWallet(
      Task.of,
      Wallet.newHDAccount(label, password, networks.btc, wrapper.version),
      wrapper
    )
    yield call(runTask, nextWrapper, A.wallet.setWrapper)
    yield refetchContextData()
  }

  const createWalletSaga = function* ({ email, language, password }) {
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

  const fetchWalletSaga = function* ({ code, guid, password, session, sharedKey }) {
    const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    yield put(A.wallet.setWrapper(wrapper))
  }

  const upgradeToV3 = function* ({ password }) {
    const wrapper = yield select(S.getWrapper)
    const hdwallets = compose(
      // @ts-ignore
      (i) => i.toJS(),
      Wallet.selectHdWallets,
      Wrapper.selectWallet
      // @ts-ignore
    )(wrapper)

    if (isEmpty(hdwallets)) {
      const mnemonic = yield call(generateMnemonic, api)
      const upgradeTask = Wrapper.upgradeToV3(mnemonic, password, networks.btc, wrapper)
      yield call(runTask, upgradeTask, A.wallet.setWrapper)
    } else {
      throw new Error('Already a v3 wallet')
    }
  }

  const upgradeToV4 = function* ({ password }) {
    const wrapper = yield select(S.getWrapper)
    const getSeedHex = yield select(S.getSeedHex, password)
    const seedHex = yield call(() => taskToPromise(getSeedHex))
    if (!Wrapper.isLatestVersion(wrapper)) {
      const upgradeTask = Wrapper.upgradeToV4(seedHex, password, networks.btc, wrapper)
      yield call(runTask, upgradeTask, A.wallet.setWrapper)
    } else {
      throw new Error('Already a v4 wallet')
    }
  }

  const findUsedAccounts = function* ({ batch, nodes }) {
    const getxpub = curry((nodes, i) =>
      nodes.map((node) => node.deriveHardened(i).neutered().toBase58())
    )
    const xpubs = map(getxpub(nodes), range(0, batch))
    const result = yield call(
      api.fetchBlockchainData,
      {
        bech32: xpubs.map(last),
        legacy: xpubs.map(head)
      },
      {
        n: 1,
        offset: 0,
        onlyShow: ''
      }
    )
    // @ts-ignore
    const isUsed = (a) => propSatisfies((n) => n > 0, 'n_tx', a)
    const search = curry((xpubGroup, addresses) =>
      any(
        isUsed,
        xpubGroup.map((xpub) => find(propEq('address', xpub), addresses))
      )
    )
    const accounts = map((xpubGroup) => search(xpubGroup)(prop('addresses', result)), xpubs)
    return (
      add(
        1,
        findLastIndex((a) => !!a, accounts)
      ) || 1
    )
  }

  const restoreWalletCredentialsFromMetadata = function* (mnemonic) {
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

  const restoreWalletFromMetadata = function* (kvCredentials, newPassword) {
    try {
      // Let's update the password and upload the new encrypted payload
      const wallet = yield call(
        api.fetchWalletWithSharedKey,
        kvCredentials.guid,
        kvCredentials.sharedKey,
        kvCredentials.password
      )
      const wrapperT = set(Wrapper.password, newPassword, wallet)
      // eslint-disable-next-line no-useless-catch
      try {
        yield call(api.saveWallet, wrapperT)
        return true
      } catch (e) {
        throw e
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error('Unable to restore wallet from metadata', e)
      return false
    }
  }

  const restoreWalletSaga = function* ({ email, kvCredentials, language, mnemonic, password }) {
    let recoveredFromMetadata

    // if we have retrieved credentials from metadata, use them to restore wallet
    if (kvCredentials) {
      recoveredFromMetadata = yield call(restoreWalletFromMetadata, kvCredentials, password)
    }

    const seed = BIP39.mnemonicToSeed(mnemonic)
    const masterNode = Bitcoin.bip32.fromSeed(seed, networks.btc)
    const legacyNode = masterNode.deriveHardened(44).deriveHardened(0)
    const bech32Node = masterNode.deriveHardened(84).deriveHardened(0)
    const nAccounts = yield call(findUsedAccounts, {
      batch: 10,
      nodes: [legacyNode, bech32Node]
    })

    // generate new guid
    let [guid, sharedKey] = yield call(api.generateUUIDs, 2)

    // use previously recovered guid and sharedKey from metadata for new wrapper if available
    if (recoveredFromMetadata) {
      guid = kvCredentials.guid
      sharedKey = kvCredentials.sharedKey
    }

    // create new wallet wrapper
    const wrapper = Wrapper.createNew(
      guid,
      password,
      sharedKey,
      mnemonic,
      language,
      undefined,
      nAccounts
    )

    // create new wallet if it wasn't recovered from metadata
    if (!recoveredFromMetadata) {
      yield call(api.createWallet, email, wrapper)
    }
    yield put(A.wallet.refreshWrapper(wrapper))
  }

  const updatePbkdf2Iterations = function* ({ iterations, password }) {
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

  const resendSmsLoginCode = function* ({ guid, sessionToken }) {
    return yield call(api.resendSmsLoginCode, guid, sessionToken)
  }

  const setHDAddressLabel = function* ({ payload }) {
    const { accountIdx, addressIdx, derivationType, label } = payload
    const wallet = yield select(S.getWallet)
    const accounts = Wallet.selectHDAccounts(wallet)
    const receiveAddress = HDAccount.getReceiveAddress(
      accounts.get(accountIdx),
      addressIdx,
      networks.btc,
      derivationType
    )
    yield put(A.kvStore.btc.addAddressLabel(receiveAddress, label))
  }

  const checkAndUpdateWalletNames = function* () {
    try {
      const accountLabels = (yield select(SS.common.btc.getHDAccounts))
        .getOrFail()
        .map((wallet) => wallet.label)
      const legacyWalletName = 'My Bitcoin Wallet'

      // loop over accounts and update labels if user hasnt customized
      // eslint-disable-next-line no-restricted-syntax
      for (const [i, acctLabel] of accountLabels.entries()) {
        if (startsWith(legacyWalletName, acctLabel)) {
          // pluck label suffix e.g. " 2"
          const labelSuffix = last(splitAt(17, acctLabel))
          const newLabel = `${BTC_ACCT_NAME}${labelSuffix}`
          yield put(A.wallet.setAccountLabel(i, newLabel))
        }
      }
    } catch (e) {
      // oh well
    }
  }

  const updateMnemonicBackup = function* () {
    try {
      const sharedKey = yield select(S.getSharedKey)
      const guid = yield select(S.getGuid)
      yield call(api.updateMnemonicBackup, sharedKey, guid)
    } catch (e) {
      // shouldn't block login
    }
  }

  const triggerMnemonicViewedAlert = function* () {
    const sharedKey = yield select(S.getSharedKey)
    const guid = yield select(S.getGuid)
    yield call(api.triggerMnemonicViewedAlert, sharedKey, guid)
  }

  const triggerNonCustodialSendAlert = function* (action) {
    const { amount, currency } = action.payload
    const sharedKey = yield select(S.getSharedKey)
    const guid = yield select(S.getGuid)
    yield call(api.triggerNonCustodialSendAlert, sharedKey, guid, currency, amount)
  }

  return {
    checkAndUpdateWalletNames,
    createWalletSaga,
    fetchWalletSaga,
    importLegacyAddress,
    newHDAccount,
    refetchContextData,
    resendSmsLoginCode,
    restoreWalletCredentialsFromMetadata,
    restoreWalletSaga,
    setHDAddressLabel,
    toggleSecondPassword,
    triggerMnemonicViewedAlert,
    triggerNonCustodialSendAlert,
    updateMnemonicBackup,
    updatePbkdf2Iterations,
    upgradeToV3,
    upgradeToV4
  }
}
