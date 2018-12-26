import { call, put, select } from 'redux-saga/effects'
import { isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, BUYSELL } from '../config'
import { callTask } from '../../../utils/functional'

export default ({ api, networks }) => {
  const createBuySell = function*(kv) {
    const newBuySellEntry = {
      sfox: {
        trades: []
      },
      coinify: {
        trades: []
      }
    }
    const newkv = set(KVStoreEntry.value, newBuySellEntry, kv)
    yield put(A.createMetadataBuySell(newkv))
  }

  const fetchMetadataBuySell = function*() {
    try {
      const typeId = derivationMap[BUYSELL]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataBuySellLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createBuySell, newkv)
      } else {
        yield put(A.fetchMetadataBuySellSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataBuySellFailure(e.message))
    }
  }

  return {
    createBuySell,
    fetchMetadataBuySell
  }
}
