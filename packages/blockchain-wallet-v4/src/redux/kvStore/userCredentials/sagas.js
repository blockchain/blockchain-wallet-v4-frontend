import { call, put, select } from 'redux-saga/effects'
import { compose, isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, USER_CREDENTIALS } from '../config'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks }) => {
  const callTask = function*(task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }

  const createUserCredentials = function*(kv) {
    const user_id = ''
    const lifetime_token = ''
    const newkv = set(KVStoreEntry.value, { user_id, lifetime_token }, kv)
    yield put(A.createMetadataUserCredentials(newkv))
  }

  const fetchMetadataUserCredentials = function*() {
    try {
      const typeId = derivationMap[USER_CREDENTIALS]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataUserCredentialsLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createUserCredentials, newkv)
      } else {
        yield put(A.fetchMetadataUserCredentialsSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataUserCredentialsFailure(e.message))
    }
  }

  return {
    fetchMetadataUserCredentials
  }
}
