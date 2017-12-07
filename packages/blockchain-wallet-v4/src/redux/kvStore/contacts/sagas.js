import { call, put, select } from 'redux-saga/effects'
import { prop, compose } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getDefaultHDWallet } from '../../wallet/selectors'
import { derivationMap, CONTACTS } from '../config'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const contacts = ({ api, kvStorePath, walletPath } = {}) => {
  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }
  const fetchContacts = function * () {
    const typeId = derivationMap[CONTACTS]
    const hdwallet = yield select(compose(getDefaultHDWallet, prop(walletPath)))
    const kv = KVStoreEntry.fromHdWallet(hdwallet, typeId)
    const newkv = yield callTask(api.fetchKVStore(kv))
    yield put(A.setContacts(newkv))
  }

  return {
    fetchContacts
  }
}
