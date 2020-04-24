import * as AT from './actionTypes'
import { actionTypes } from 'data'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const simpleBuySagas = sagas({ api, coreSagas, networks })

  return function * simpleBuySaga () {
    yield takeLatest(AT.ACTIVATE_SB_CARD, simpleBuySagas.activateSBCard)
    yield takeLatest(AT.CANCEL_ORDER, simpleBuySagas.cancelSBOrder)
    yield takeLatest(AT.CREATE_ORDER, simpleBuySagas.createSBOrder)
    yield takeLatest(
      AT.CONFIRM_BANK_TRANSFER_ORDER,
      simpleBuySagas.confirmSBBankTransferOrder
    )
    yield takeLatest(
      AT.CONFIRM_CREDIT_CARD_ORDER,
      simpleBuySagas.confirmSBCreditCardOrder
    )
    yield takeLatest(
      AT.FETCH_EVERYPAY_3DS_DETAILS,
      simpleBuySagas.fetchEverypay3DSDetails
    )
    yield takeLatest(AT.FETCH_SB_CARD, simpleBuySagas.fetchSBCard)
    yield takeLatest(AT.FETCH_SB_CARDS, simpleBuySagas.fetchSBCards)
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
    yield takeLatest(
      AT.FETCH_SB_PAYMENT_METHODS,
      simpleBuySagas.fetchSBPaymentMethods
    )
    yield takeLatest(AT.FETCH_SB_QUOTE, simpleBuySagas.fetchSBQuote)
    yield takeLatest(
      AT.FETCH_SB_SUGGESTED_AMOUNTS,
      simpleBuySagas.fetchSBSuggestedAmounts
    )
    yield takeLatest(
      AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
      simpleBuySagas.handleSBSuggestedAmountClick
    )
    yield takeLatest(AT.INITIALIZE_CHECKOUT, simpleBuySagas.initializeCheckout)
    yield takeLatest(AT.POLL_SB_CARD, simpleBuySagas.pollSBCard)
    yield takeLatest(AT.POLL_SB_ORDER, simpleBuySagas.pollSBOrder)
    yield takeLatest(AT.SHOW_MODAL, simpleBuySagas.showModal)
    // Fetch balances when profile/user is fetched
    yield takeLatest(
      actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
      simpleBuySagas.fetchSBBalances
    )
    // yield takeLatest(AT.FETCH_SB_BALANCES, simpleBuySagas.fetchSBBalances)
  }
}
