import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const borrowSagas = sagas({ api, coreSagas, networks })

  return function * borrowSaga() {
    yield takeLatest(AT.ADD_COLLATERAL, borrowSagas.addCollateral)
    yield takeLatest(
      AT.AMT_COLLATERAL_REQUIRED_CLICK,
      borrowSagas.amtCollateralRequiredClick
    )
    yield takeLatest(AT.CREATE_BORROW, borrowSagas.createBorrow)
    yield takeLatest(AT.DESTROY_BORROW, borrowSagas.destroyBorrow)
    yield takeLatest(AT.FETCH_BORROW_OFFERS, borrowSagas.fetchBorrowOffers)
    yield takeLatest(
      AT.FETCH_LOAN_TRANSACTIONS,
      borrowSagas.fetchLoanTransactions
    )
    yield takeLatest(
      AT.FETCH_USER_BORROW_HISTORY,
      borrowSagas.fetchUserBorrowHistory
    )
    yield takeLatest(AT.INITIALIZE_BORROW, borrowSagas.initializeBorrow)
    yield takeLatest(AT.INITIALIZE_REPAY_LOAN, borrowSagas.initializeRepayLoan)
    yield takeLatest(AT.MAX_COLLATERAL_CLICK, borrowSagas.maxCollateralClick)
    yield takeLatest(AT.REPAY_LOAN, borrowSagas.repayLoan)
    yield takeEvery(actionTypes.CHANGE, borrowSagas.formChanged)
  }
}
