import { call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getDefaultHDWallet } from '../../wallet/selectors'
import { derivationMap, WHATSNEW } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const whatsNew = ({ kvStoreApi, kvStorePath, walletPath } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const fetchWhatsNew = function * () {
    const typeId = derivationMap[WHATSNEW]
    const hdwallet = yield select(compose(getDefaultHDWallet, prop(walletPath)))
    const kv = KVStoreEntry.fromHdWallet(hdwallet, typeId)
    const newkv = yield callTask(kvStoreApi.fetch(kv))
    yield put(A.setWhatsNew(newkv))
  }

  return {
    fetchWhatsNew
  }
}
