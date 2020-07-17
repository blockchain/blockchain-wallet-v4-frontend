import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const dataFiatSagas = sagas({ api })

  return function * coreDataFiatSaga () {
    yield takeLatest(
      AT.FETCH_FIAT_TRANSACTIONS,
      dataFiatSagas.fetchTransactions
    )
  }
}
