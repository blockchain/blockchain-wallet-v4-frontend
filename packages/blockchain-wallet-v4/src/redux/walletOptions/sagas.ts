import { call, put } from 'redux-saga/effects'

import { actions } from './slice'

export default ({ api }) => {
  const fetchOptions = function* () {
    try {
      yield put(actions.fetchOptionsLoading())
      const data = yield call(api.getWalletOptions)
      yield put(actions.fetchOptionsSuccess(data))
    } catch (e) {
      yield put(actions.fetchOptionsFailure(e.message))
    }
  }

  return {
    fetchOptions
  }
}
