import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const analyticsSagas = sagas({ api, coreSagas })
  console.log('analytics register', analyticsSagas)
  return function* () {
    yield takeLatest(AT.REPORT_BALANCE_STATS, analyticsSagas.reportBalanceStats)
  }
}
