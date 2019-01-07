import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const analyticsSagas = sagas({ api })
  return function* analyticsSaga () {
    yield takeLatest(AT.REPORT_BALANCE_STATS, analyticsSagas.reportBalanceStats)
  }
}
