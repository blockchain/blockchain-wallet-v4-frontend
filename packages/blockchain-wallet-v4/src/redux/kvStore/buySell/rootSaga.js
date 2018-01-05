
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, BUYSELL } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  const fetchMetadataBuysell = function * () {
    try {
      const typeId = derivationMap[BUYSELL]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBuysellLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataBuysellSuccess(newkv))
    } catch (e) {
      yield put(A.fetchMetadataBuysellFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_BUYSELL, fetchMetadataBuysell)
  }
}
