import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const transactionReportSagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.TRANSACTION_REPORT_INITIALIZED, transactionReportSagas.initialized)
    yield takeLatest(AT.TRANSACTION_REPORT_DESTROYED, transactionReportSagas.destroyed)
    yield takeLatest(AT.TRANSACTION_REPORT_SUBMIT_CLICKED, transactionReportSagas.submitClicked)
    yield takeEvery(actionTypes.CHANGE, transactionReportSagas.formChanged)
  }
}
