import { put, call } from 'redux-saga/effects'
import { prop } from 'ramda'

import * as A from './actions'

export default ({ api }) => {
  const fetchLimits = function*({ payload }) {
    const currency = prop('currency', payload)
    try {
      yield put(A.fetchLimitsLoading(currency))
      const limits = yield call(api.fetchLimits)
      yield put(A.fetchLimitsSuccess(currency, limits))
    } catch (e) {
      yield put(A.fetchLimitsError(currency, e))
    }
  }

  return { fetchLimits }
}
