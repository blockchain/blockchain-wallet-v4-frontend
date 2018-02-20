
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { set } from 'ramda-lens'
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

  const createBuysell = function * (kv) {
    const newBuysellEntry = {
      sfox: {},
      coinify: {},
      unocoin: {}
    }
    const newkv = set(KVStoreEntry.value, newBuysellEntry, kv)
    yield put(A.createMetadataBuysell(newkv))
  }

  const fetchMetadataBuySell = function * () {
    try {
      const typeId = derivationMap[BUYSELL]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataBuySellLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value)) {
        yield call(createBuysell, newkv)
      } else {
        yield put(A.fetchMetadataBuySellSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataBuySellFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_BUYSELL, fetchMetadataBuySell)
  }
}
