import * as AT from './actionTypes'
import { actionTypes } from 'data'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const simpleBuySagas = sagas({ api, coreSagas, networks })

  return function * simpleBuySaga () {
    yield takeLatest(AT.CANCEL_ORDER, simpleBuySagas.cancelSBOrder)
    yield takeLatest(AT.CREATE_ORDER, simpleBuySagas.createSBOrder)
    yield takeLatest(AT.CONFIRM_ORDER, simpleBuySagas.confirmSBOrder)
    yield takeLatest(
      AT.FETCH_SB_FIAT_ELIGIBLE,
      simpleBuySagas.fetchSBFiatEligible
    )
    yield takeLatest(AT.FETCH_SB_ORDERS, simpleBuySagas.fetchSBOrders)
    yield takeLatest(AT.FETCH_SB_PAIRS, simpleBuySagas.fetchSBPairs)
    yield takeLatest(
      AT.FETCH_SB_PAYMENT_ACCOUNT,
      simpleBuySagas.fetchSBPaymentAccount
    )
    yield takeLatest(AT.FETCH_SB_QUOTE, simpleBuySagas.fetchSBQuote)
    yield takeLatest(
      AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
      simpleBuySagas.handleSBSuggestedAmountClick
    )
    yield takeLatest(AT.INITIALIZE_CHECKOUT, simpleBuySagas.initializeCheckout)
    yield takeLatest(AT.SHOW_MODAL, simpleBuySagas.showModal)
    // Fetch balances when profile/user is fetched
    yield takeLatest(
      actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
      simpleBuySagas.fetchSBBalances
    )
    // yield takeLatest(AT.FETCH_SB_BALANCES, simpleBuySagas.fetchSBBalances)
  }
}
