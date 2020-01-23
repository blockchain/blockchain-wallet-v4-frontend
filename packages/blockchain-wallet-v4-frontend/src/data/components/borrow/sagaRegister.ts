import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const borrowSagas = sagas({ api, coreSagas, networks })

  return function * borrowSaga () {
    yield takeLatest(AT.CREATE_BORROW, borrowSagas.createBorrow)
    yield takeLatest(AT.FETCH_BORROW_OFFERS, borrowSagas.fetchBorrowOffers)
    yield takeLatest(AT.INITIALIZE_BORROW, borrowSagas.initializeBorrow)
    yield takeLatest(AT.MAX_COLLATERAL_CLICK, borrowSagas.maxCollateralClick)
    yield takeEvery(actionTypes.CHANGE, borrowSagas.formChanged)
  }
}
