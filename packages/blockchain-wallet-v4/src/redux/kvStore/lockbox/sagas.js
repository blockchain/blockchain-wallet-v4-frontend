import { isEmpty, isNil } from 'ramda'
import { set } from 'ramda-lens'
import { put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import { callTask } from '../../../utils/functional'
import { derivationMap, LOCKBOX } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

export default ({ api, networks }) => {
  const fetchMetadataLockbox = function* () {
    try {
      const typeId = derivationMap[LOCKBOX]
      const xPriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(xPriv, typeId, networks.btc)
      yield put(A.fetchMetadataLockboxLoading())
      let newKv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newKv.value) || isEmpty(newKv.value)) {
        const baseEntry = {
          devices: [],
          version: 4
        }
        newKv = set(KVStoreEntry.value, baseEntry, newKv)
      }
      yield put(A.fetchMetadataLockboxSuccess(newKv))
    } catch (e) {
      yield put(A.fetchMetadataLockboxFailure(e.message))
      return -1
    }
  }

  return {
    fetchMetadataLockbox
  }
}
