import { call, put, select } from 'redux-saga/effects'
// import BIP39 from 'bip39'
// import Bitcoin from 'bitcoinjs-lib'
import { prop, compose, endsWith, repeat, range, map, propSatisfies,
         dropLastWhile, not, length, concat, propEq, is, find } from 'ramda'
import Task from 'data.task'
// import Either from 'data.either'
import * as A from './actions'
import { KVStoreEntry } from '../../types'
import { getDefaultHDWallet } from '../wallet/selectors'
// const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))
// const eitherToTask = e => e.fold(Task.rejected, Task.of)
const kvDictionary = {
  'buy-sell': 2
}

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const kvStoreSaga = ({ kvStoreApi, kvStorePath, walletPath } = {}) => {

  const callTask = function * (task) {
    return yield call(compose(taskToPromise, () => task))
  }

  // const fetchKVStore = function * ({ guid, sharedKey, session, password, code }) {
  const fetchKVStoreFromType = function * ({ type }) {
    console.log(type)
    const typeId = prop(type, kvDictionary)
    const hdwallet = yield select(compose(getDefaultHDWallet, prop(walletPath)))
    const kv = KVStoreEntry.fromHdWallet(hdwallet, typeId)
    const newkv = yield callTask(kvStoreApi.fetch(kv))
    // const y = newkv.toObject()
    // const x = KVStoreEntry.reviver(y)
    // console.log(x)
    // yield put(A.setKVStore(type, newkv))

    // const wrapper = yield call(api.fetchWallet, guid, sharedKey, session, password, code)
    // yield put(A.setWrapper(wrapper))
  }

  return {
    fetchKVStoreFromType
  }
}
