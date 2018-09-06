import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const analyticsSagas = sagas({ api, coreSagas })
  return function* () {
    yield takeLatest(AT.REPORT_BALANCE_STATS, analyticsSagas.reportBalanceStats)
    yield takeLatest(AT.LOG_LEFT_NAV_CLICK, analyticsSagas.logLeftNavClick)
  }
}
