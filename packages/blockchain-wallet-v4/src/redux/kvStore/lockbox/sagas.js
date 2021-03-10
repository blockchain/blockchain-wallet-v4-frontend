import { isEmpty, isNil } from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import { derivationMap, LOCKBOX } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks }) => {
  const createLockbox = function * (kv) {
    const newLockboxEntry = {
      devices: []
    }
    const newkv = set(KVStoreEntry.value, newLockboxEntry, kv)
    yield put(A.createMetadataLockbox(newkv))
  }

  const fetchMetadataLockbox = function * () {
    try {
      const typeId = derivationMap[LOCKBOX]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataLockboxLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createLockbox, newkv)
      } else {
        yield put(A.fetchMetadataLockboxSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataLockboxFailure(e.message))
      return -1
    }
  }

  return {
    createLockbox,
    fetchMetadataLockbox
  }
}
