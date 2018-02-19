
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import * as AT from './actionTypes'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, WHATSNEW } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const createWhatsNew = function * (kv) {
    const lastViewed = 0
    const newkv = set(KVStoreEntry.value, { lastViewed }, kv)
    yield put(A.createMetadataWhatsnew(newkv))
  }

  const fetchMetadataWhatsnew = function * () {
    try {
      const typeId = derivationMap[WHATSNEW]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataWhatsnewLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value)) {
        yield call(createWhatsNew, newkv)
      } else {
        yield put(A.fetchMetadataWhatsnewSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataWhatsnewFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_WHATSNEW, fetchMetadataWhatsnew)
  }
}
