import * as A from './actions'
import { call, put, select } from 'redux-saga/effects'
import { callTask } from '../../../utils/functional'
import { CONTACTS, derivationMap } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { isEmpty, isNil } from 'ramda'
import { KVStoreEntry } from '../../../types'

export default ({ api, networks }) => {
  const createContacts = function * (kv) {
    // TOOD : empty contacts implementation
    // const newEntry = {}
    // const newkv = set(KVStoreEntry.value, newEntry, kv)
    // yield put(A.createMetadataContacts(newkv))
  }

  // const fetchContacts = function*() {
  //   const typeId = derivationMap[CONTACTS]
  //   const mxpriv = yield select(getMetadataXpriv)
  //   const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
  //   const newkv = yield callTask(api.fetchKVStore(kv))
  //   yield put(A.setContacts(newkv))
  // }

  const fetchMetadataContacts = function * () {
    try {
      const typeId = derivationMap[CONTACTS]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataContactsLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createContacts, newkv)
      } else {
        yield put(A.fetchMetadataContactsSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataContactsFailure(e.message))
    }
  }

  return {
    fetchMetadataContacts
  }
}
