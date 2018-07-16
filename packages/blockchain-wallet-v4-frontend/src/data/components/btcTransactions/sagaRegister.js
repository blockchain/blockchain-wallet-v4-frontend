import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const btcTransactionsSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.BTC_TRANSACTIONS_INITIALIZED, btcTransactionsSagas.initialized)
    yield takeEvery(AT.BTC_TRANSACTIONS_REPORT_CLICKED, btcTransactionsSagas.reportClicked)
    yield takeEvery(actionTypes.form.CHANGE, btcTransactionsSagas.formChanged)
    yield takeEvery(actionTypes.scroll.UPDATE_SCROLL, btcTransactionsSagas.scrollUpdated)
  }
}
