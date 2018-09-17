import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'
import {
  LAYOUT_WALLET_HEADER_FAQ_CLICKED,
  LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED
} from '../components/layoutWallet/actionTypes'

export default ({ api, coreSagas }) => {
  const analyticsSagas = sagas({ api, coreSagas })
  return function*() {
    yield takeLatest(AT.REPORT_BALANCE_STATS, analyticsSagas.reportBalanceStats)
    yield takeLatest(AT.LOG_LEFT_NAV_CLICK, analyticsSagas.logLeftNavClick)
    yield takeLatest(AT.LOG_CLICK, analyticsSagas.logClick)
    yield takeLatest(LAYOUT_WALLET_HEADER_FAQ_CLICKED, analyticsSagas.logClick)
    yield takeLatest(
      LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED,
      analyticsSagas.logClick
    )
  }
}
