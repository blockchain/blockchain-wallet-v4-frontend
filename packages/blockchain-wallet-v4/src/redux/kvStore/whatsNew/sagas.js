import { call, put, select } from 'redux-saga/effects'
import { isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, WHATSNEW } from '../config'
import { callTask } from '../../../utils/functional'

export default ({ api, networks }) => {
  const createWhatsNew = function*(kv) {
    const lastViewed = 0
    const newkv = set(KVStoreEntry.value, { lastViewed }, kv)
    yield put(A.createMetadataWhatsnew(newkv))
  }

  const fetchMetadataWhatsnew = function*() {
    try {
      const typeId = derivationMap[WHATSNEW]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataWhatsnewLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createWhatsNew, newkv)
      } else {
        yield put(A.fetchMetadataWhatsnewSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataWhatsnewFailure(e.message))
    }
  }

  return {
    fetchMetadataWhatsnew
  }
}
