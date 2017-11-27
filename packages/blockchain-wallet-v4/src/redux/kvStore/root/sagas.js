import { call, put, select } from 'redux-saga/effects'
import { prop, compose, isNil } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getGuid, getMainPassword, getSharedKey } from '../../wallet/selectors'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const root = ({ api, kvStorePath, walletPath } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const fetchRoot = function * () {
    const guid = yield select(compose(getGuid, prop(walletPath)))
    const sharedKey = yield select(compose(getSharedKey, prop(walletPath)))
    const password = yield select(compose(getMainPassword, prop(walletPath)))
    const kv = KVStoreEntry.fromCredentials(guid, sharedKey, password)
    const newkv = yield callTask(api.fetchKVStore(kv))
    yield put(A.set(newkv))
    if (isNil(prop('metadata', newkv.value))) {
      // when to ask second password?
      console.log('no metadata')
    }
    // Bitcoin.HDNode.fromBase58(xpub, network)
  }

  return {
    fetchRoot
  }
}
