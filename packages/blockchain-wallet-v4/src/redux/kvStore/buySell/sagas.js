import { call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, BUYSELL } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const buySell = ({ api, kvStorePath, walletPath } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const fetchBuySell = function * () {
    const typeId = derivationMap[BUYSELL]
    const mxpriv = yield select(compose(getMetadataXpriv, prop(kvStorePath)))
    const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
    const newkv = yield callTask(api.fetchKVStore(kv))
    yield put(A.setBuySell(newkv))
  }

  return {
    fetchBuySell
  }
}
