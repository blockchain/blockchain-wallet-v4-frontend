import { call, put } from 'redux-saga/effects'

import * as A from './actions'

export default ({ api }) => {
  const fetchOptions = function * () {
    try {
      yield put(A.fetchOptionsLoading())
      const data = yield call(api.getWalletOptions)
      yield put(A.fetchOptionsSuccess(data))
    } catch (e) {
      yield put(A.fetchOptionsFailure(e.message))
    }
  }

  return {
    fetchOptions
  }
}
