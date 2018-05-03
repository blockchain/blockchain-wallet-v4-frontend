import { call, put, select } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, CONTACTS } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const createContacts = function * (kv) {
    // TOOD : empty contacts implementation
    // const newEntry = {}
    // const newkv = set(KVStoreEntry.value, newEntry, kv)
    // yield put(A.createMetadataContacts(newkv))
  }

  const fetchContacts = function * () {
    const typeId = derivationMap[CONTACTS]
    const mxpriv = yield select(getMetadataXpriv)
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
    const newkv = yield callTask(api.fetchKVStore(kv))
    yield put(A.setContacts(newkv))
  }

  const fetchMetadataContacts = function * () {
    try {
      const typeId = derivationMap[CONTACTS]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataContactsLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value)) {
        yield call(createContacts, newkv)
      } else {
        yield put(A.fetchMetadataContactsSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataContactsFailure(e.message))
    }
  }

  return {
    fetchContacts,
    fetchMetadataContacts
  }
}
