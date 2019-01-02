import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'
import {
  LAYOUT_WALLET_HEADER_FAQ_CLICKED,
  LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED
} from '../components/layoutWallet/actionTypes'

export default ({ api }) => {
  const analyticsSagas = sagas({ api })
  return function* analyticsSaga () {
    yield takeLatest(AT.REPORT_BALANCE_STATS, analyticsSagas.reportBalanceStats)
    yield takeLatest(AT.LOG_LOCKBOX_SETUP, analyticsSagas.logLockboxSetup)
    yield takeLatest(LAYOUT_WALLET_HEADER_FAQ_CLICKED, analyticsSagas.logClick)
    yield takeLatest(
      LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED,
      analyticsSagas.logClick
    )
    yield takeLatest(AT.LOG_SFOX_DROPOFF, analyticsSagas.logSfoxDropoff)
    yield takeLatest(AT.LOG_CLICK, analyticsSagas.logClick)
    yield takeLatest(AT.LOG_KYC_EVENT, analyticsSagas.logKycEvent)
    yield takeLatest(AT.LOG_EXCHANGE_EVENT, analyticsSagas.logExchangeEvent)
  }
}
