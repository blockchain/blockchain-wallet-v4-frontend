import { call, put } from 'redux-saga/effects'

import { APIType } from 'core/network/api'

import * as A from './actions'

export default ({ api }: { api: APIType }) => {
  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getCoinTicker, 'ALGO')
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  return {
    fetchRates
  }
}
