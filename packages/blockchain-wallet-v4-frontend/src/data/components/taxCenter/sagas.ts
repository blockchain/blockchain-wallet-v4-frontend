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
      errorHandler(e)
      yield put(A.getReportsFailure())
    }
  }

  const createReport = function* (action: ReturnType<typeof A.createReport>) {
    try {
      const { payload } = action
      yield call(api.createReport, payload)
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createReportFailure(error))
    }
  }

  return {
    createReport,
    getReports
  }
}
