import { call, put, select } from 'redux-saga/effects'
import { prop, compose, isNil } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getGuid, getSharedKey } from '../../wallet/selectors'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, securityModule = {}, networks }) => {
  const callTask = function * (task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }
  const createRoot = function * ({ password }) {
    try {
      const metadata = yield call(
        securityModule.deriveBIP32Key,
        {
          network: networks.btc,
          secondPassword: password
        },
        `m/${KVStoreEntry.metadataPurpose}'`
      )

      yield put(A.updateMetadataRoot({ metadata }))
    } catch (e) {
      throw new Error('create root Metadata :: Error decrypting mnemonic')
    }
  }

  const fetchRoot = function * (secondPasswordSagaEnhancer) {
    try {
      const guid = yield select(getGuid)
      const sharedKey = yield select(getSharedKey)
      yield put(A.fetchMetadataRootLoading())

      const entropy = yield call(securityModule.generateCredentialsEntropy, {
        guid,
        sharedKey
      })

      const kv = yield call(KVStoreEntry.fromEntropy, {
        entropy,
        network: networks.btc
      })

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
