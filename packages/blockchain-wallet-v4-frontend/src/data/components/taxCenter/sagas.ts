import { call, put } from 'redux-saga/effects'

import { APIType } from '@core/network/api'

import { actions as A } from './slice'

export default ({ api }: { api: APIType }) => {
  const getReports = function* () {
    try {
      const data = yield call(api.getReports)
      yield put(A.getReportsSuccess(data.reports))
    } catch (e) {
      yield put(A.getReportsFailure())
    }
  }

  const createReport = function* (action: ReturnType<typeof A.createReport>) {
    try {
      const { payload } = action
      yield call(api.createReport, payload)
      yield put(A.createReportSuccess())
    } catch (e) {
      yield put(A.createReportFailure())
    }
  }

  return {
    createReport,
    getReports
  }
}
