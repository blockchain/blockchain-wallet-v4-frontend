import * as T from './actionTypes'

export const syncKv = (kv) => ({ type: T.KV_SYNC, payload: kv })

export const setKVStore = (key, data) => ({ type: T.SET_KV_STORE, payload: {key, data} })
