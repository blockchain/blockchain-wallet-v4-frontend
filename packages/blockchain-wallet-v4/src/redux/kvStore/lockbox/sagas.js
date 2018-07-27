import { call, put, select } from 'redux-saga/effects'
import { compose } from 'ramda'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { derivationMap, LOCKBOX } from '../config'
import { getMetadataXpriv } from '../root/selectors'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const callTask = function*(task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }

  const createMetadataLockbox = function*() {
    // TODO
    // yield call(delay, 1000)
    // const typeId = derivationMap[LOCKBOX]
    // yield put(A.createMetadataLockbox({}))
  }

  const fetchMetadataLockbox = function*() {
    try {
      const typeId = derivationMap[LOCKBOX]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId)
      yield put(A.fetchMetadataLockboxLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      yield put(A.fetchMetadataLockboxSuccess(newkv))
      return -1
    } catch (e) {
      yield put(A.fetchMetadataLockboxFailure(e.message))
      return -1
    }
  }

  return {
    fetchMetadataLockbox,
    createMetadataLockbox
  }
}
