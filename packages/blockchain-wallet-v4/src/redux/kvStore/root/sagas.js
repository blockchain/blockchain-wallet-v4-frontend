import { call, put, select } from 'redux-saga/effects'
import { prop, compose, isNil } from 'ramda'
import * as A from './actions'
import BIP39 from 'bip39'
import { KVStoreEntry } from '../../../types'
import { getMnemonic, getGuid, getMainPassword, getSharedKey } from '../../wallet/selectors'
const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const createRoot = function * ({ password }) {
    const mnemonic = state => getMnemonic(state, password)
    const eitherMnemonic = yield select(mnemonic)
    if (eitherMnemonic.isRight) {
      const seedHex = BIP39.mnemonicToEntropy(eitherMnemonic.value)
      const getMetadataNode = compose(KVStoreEntry.deriveMetadataNode, KVStoreEntry.getMasterHDNode)
      const metadataNode = getMetadataNode(seedHex)
      const metadata = metadataNode.toBase58()
      yield put(A.updateMetadataRoot({ metadata }))
    } else {
      throw new Error('create root Metadata :: Error decrypting mnemonic')
    }
  }

  const fetchRoot = function * (secondPasswordSagaEnhancer) {
    try {
      const guid = yield select(getGuid)
      const sharedKey = yield select(getSharedKey)
      const mainPassword = yield select(getMainPassword)
      yield put(A.fetchMetadataRootLoading())
      const kv = KVStoreEntry.fromCredentials(guid, sharedKey, mainPassword)
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataRootSuccess(newkv))
      if (isNil(prop('metadata', newkv.value))) { // no metadata node saved
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
