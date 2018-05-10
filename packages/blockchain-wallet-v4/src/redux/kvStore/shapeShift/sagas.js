import { call, put, select } from 'redux-saga/effects'
import { compose, isNil } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, SHAPESHIFT } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const fetchShapeShift = function * () {
    const typeId = derivationMap[SHAPESHIFT]
    const mxpriv = yield select(getMetadataXpriv)
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
    const newkv = yield callTask(api.fetchKVStore(kv))
    yield put(A.setShapeShift(newkv))
  }

  const fetchShapeshiftTrade = function * (address) {
    try {
      const tradeDetails = yield call(api.getTradeStatus, address)
      yield put(A.fetchShapeshiftTradeSuccess(tradeDetails))
    } catch (e) {
      yield put(A.fetchShapeshiftTradeFailure(e.message))
    }
  }

  const createShapeshift = function * (kv) {
    const newShapeshiftEntry = {
      trades: [],
      USAState: null
    }
    const newkv = set(KVStoreEntry.value, newShapeshiftEntry, kv)
    yield put(A.createMetadataShapeshift(newkv))
  }

  const fetchMetadataShapeshift = function * () {
    try {
      const typeId = derivationMap[SHAPESHIFT]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataShapeshiftLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataShapeshiftSuccess(newkv))
      if (isNil(newkv.value)) {
        yield call(createShapeshift, newkv)
      } else {
        yield put(A.fetchMetadataShapeshiftSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataShapeshiftFailure(e.message))
    }
  }

  return {
    createShapeshift,
    fetchShapeShift,
    fetchShapeshiftTrade,
    fetchMetadataShapeshift
  }
}
