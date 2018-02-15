
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, BCH } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const fetchMetadataBch = function * () {
    try {
      const typeId = derivationMap[BCH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBchLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataBchSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBchFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_BCH, fetchMetadataBch)
  }
}
