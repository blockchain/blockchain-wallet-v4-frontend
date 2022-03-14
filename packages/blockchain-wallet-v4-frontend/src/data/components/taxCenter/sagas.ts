import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const getReports = function* () {
    try {
      const data = yield call(api.getReports)
      yield put(A.getReportsSuccess(data.reports))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.getReportsFailure())
    }
  }

  return {
    getReports
  }
}
