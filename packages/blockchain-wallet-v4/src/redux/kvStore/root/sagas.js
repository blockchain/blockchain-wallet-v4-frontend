import BIP39 from 'bip39'
import { compose, isNil, prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import {
  getGuid,
  getMainPassword,
  getMnemonic,
  getSharedKey
} from '../../wallet/selectors'
import * as A from './actions'
const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const createRoot = function * ({ password }) {
    try {
      const obtainMnemonic = state => getMnemonic(state, password)
      const mnemonicT = yield select(obtainMnemonic)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      const seedHex = BIP39.mnemonicToEntropy(mnemonic)
      const getMetadataNode = compose(
        KVStoreEntry.deriveMetadataNode,
        KVStoreEntry.getMasterHDNode(networks.btc)
      )
      const metadataNode = getMetadataNode(seedHex)
      const metadata = metadataNode.toBase58()
      yield put(A.updateMetadataRoot({ metadata }))
    } catch (e) {
      throw new Error('create root Metadata :: Error decrypting mnemonic')
    }
  }

  const fetchRoot = function * (secondPasswordSagaEnhancer) {
    try {
      const guid = yield select(getGuid)
      const sharedKey = yield select(getSharedKey)
      const mainPassword = yield select(getMainPassword)
      yield put(A.fetchMetadataRootLoading())
      const kv = KVStoreEntry.fromCredentials(
        guid,
        sharedKey,
        mainPassword,
        networks.btc
      )
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataRootSuccess(newkv))
      if (isNil(prop('metadata', newkv.value))) {
        // no metadata node saved
        const createRootenhanced = secondPasswordSagaEnhancer(createRoot)
        yield call(createRootenhanced, {})
      }
    } catch (e) {
      yield put(A.fetchMetadataRootFailure(e.message))
    }
  }

  return {
    fetchRoot
  }
}
