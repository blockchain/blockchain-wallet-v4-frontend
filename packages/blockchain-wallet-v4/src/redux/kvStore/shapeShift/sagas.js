import { call, put, select } from 'redux-saga/effects'
import { isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, SHAPESHIFT } from '../config'
import { callTask } from '../../../utils/functional'

export default ({ api, networks }) => {
  const fetchShapeshiftTrade = function*(address) {
    try {
      const tradeDetails = yield call(api.getTradeStatus, address)
      yield put(A.fetchShapeshiftTradeSuccess(tradeDetails))
    } catch (e) {
      yield put(A.fetchShapeshiftTradeFailure(e.message))
    }
  }

  const createShapeshift = function*(kv) {
    const newShapeshiftEntry = {
      trades: [],
      USAState: null
    }
    const newkv = set(KVStoreEntry.value, newShapeshiftEntry, kv)
    yield put(A.createMetadataShapeshift(newkv))
  }

  const fetchMetadataShapeshift = function*() {
    try {
      const typeId = derivationMap[SHAPESHIFT]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataShapeshiftLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
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
    fetchShapeshiftTrade,
    fetchMetadataShapeshift
  }
}
