import { call, delay, put } from 'redux-saga/effects'

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
      const { from, to, walletData } = action.payload
      yield put(A.createReportLoading())
      yield delay(2000)
      yield call(api.createReport, {
        ...walletData.getOrFail('Failed to fetch wallet data'),
        from,
        to
      })
      yield put(A.createReportSuccess())
      yield put(A.getReports())
    } catch (e) {
      yield put(A.createReportFailure(e))
    }
  }

  return {
    createReport,
    getReports
  }
}
