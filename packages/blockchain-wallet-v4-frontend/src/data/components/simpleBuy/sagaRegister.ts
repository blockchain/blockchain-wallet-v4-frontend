import { Task } from 'redux-saga'
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
  takeLatest
} from 'redux-saga/effects'

import { actions, actionTypes } from 'data'

import profileSagas from '../../modules/profile/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import sagas from './sagas'

let pollTask: Task

export default ({ api, coreSagas, networks }) => {
  const simpleBuySagas = sagas({ api, coreSagas, networks })
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  return function * simpleBuySaga() {
    yield takeEvery(actionTypes.form.CHANGE, simpleBuySagas.formChanged)
    yield takeLatest(AT.ACTIVATE_SB_CARD, simpleBuySagas.activateSBCard)
    yield takeLatest(AT.ADD_CARD_DETAILS, simpleBuySagas.addCardDetails)
    yield takeLatest(AT.ADD_CARD_FINISHED, simpleBuySagas.addCardFinished)
    yield takeLatest(AT.CANCEL_ORDER, simpleBuySagas.cancelSBOrder)
    yield takeLatest(AT.CREATE_ORDER, simpleBuySagas.createSBOrder)
    yield takeLatest(AT.CONFIRM_FUNDS_ORDER, simpleBuySagas.confirmSBFundsOrder)
    yield takeLatest(
      AT.CONFIRM_CREDIT_CARD_ORDER,
      simpleBuySagas.confirmSBCreditCardOrder
    )
    yield takeLatest(AT.FETCH_SB_BALANCES, simpleBuySagas.fetchSBBalances)
    yield takeLatest(AT.DELETE_SB_CARD, simpleBuySagas.deleteSBCard)
    yield takeLatest(AT.FETCH_SB_CARD, simpleBuySagas.fetchSBCard)
    yield takeLatest(AT.FETCH_SB_CARDS, simpleBuySagas.fetchSBCards)
    yield takeLatest(
      AT.FETCH_SB_FIAT_ELIGIBLE,
      simpleBuySagas.fetchSBFiatEligible
    )
    yield takeLatest(AT.FETCH_SDD_ELIGIBILITY, simpleBuySagas.fetchSDDEligible)
    yield takeLatest(AT.FETCH_SDD_VERIFIED, simpleBuySagas.fetchSDDVerified)
    yield takeLatest(AT.FETCH_LIMITS, simpleBuySagas.fetchLimits)
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
      AT.HANDLE_SB_DEPOSIT_FIAT_CLICK,
      simpleBuySagas.handleSBDepositFiatClick
    )
    yield takeLatest(
      AT.HANDLE_SB_METHOD_CHANGE,
      simpleBuySagas.handleSBMethodChange
    )
    yield takeLatest(
      AT.HANDLE_SB_SUGGESTED_AMOUNT_CLICK,
      simpleBuySagas.handleSBSuggestedAmountClick
    )
    yield takeLatest(
      AT.INITIALIZE_BILLING_ADDRESS,
      simpleBuySagas.initializeBillingAddress
    )
    yield takeLatest(AT.INITIALIZE_CHECKOUT, simpleBuySagas.initializeCheckout)
    yield takeLatest(AT.POLL_SB_BALANCES, simpleBuySagas.pollSBBalances)
    yield takeLatest(AT.POLL_SB_CARD, simpleBuySagas.pollSBCard)
    yield takeLatest(AT.POLL_SB_ORDER, simpleBuySagas.pollSBOrder)
    yield takeLatest(AT.SHOW_MODAL, simpleBuySagas.showModal)
    yield takeLatest(AT.SWITCH_FIX, simpleBuySagas.switchFix)
    // Fetch balances when profile/user is fetched
    yield takeLatest(
      [
        actionTypes.modules.profile.FETCH_USER_DATA_FAILURE,
        actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
        actionTypes.modules.profile.SET_API_TOKEN_FAILURE
      ],
      simpleBuySagas.fetchSBBalances
    )
    // Fetch balances and orders when step changes to order summary
    yield takeLatest(AT.SET_STEP, simpleBuySagas.setStepChange)
    // Refresh coin tx lists
    yield takeLatest(AT.FETCH_SB_ORDERS, function * () {
      yield call(waitForUserData)
      yield put(actions.core.data.bch.fetchTransactions('', true))
      yield put(actions.core.data.btc.fetchTransactions('', true))
      yield put(actions.core.data.eth.fetchTransactions('', true))
      yield put(actions.core.data.eth.fetchErc20Transactions('pax', true))
      yield put(actions.core.data.eth.fetchErc20Transactions('usdt', true))
      yield put(actions.core.data.eth.fetchErc20Transactions('wdgld', true))
      yield put(actions.core.data.xlm.fetchTransactions('', true))
    })

    // used for sell only now, eventually buy as well
    // TODO: use swap2 quote for buy AND sell
    yield takeLatest(AT.START_POLL_SELL_QUOTE, function * (
      payload: ReturnType<typeof A.startPollSellQuote>
    ) {
      if (pollTask && pollTask.isRunning) yield cancel(pollTask)
      pollTask = yield fork(simpleBuySagas.fetchSellQuote, payload)
      yield take(AT.STOP_POLL_SELL_QUOTE)
      yield cancel(pollTask)
    })
  }
}
