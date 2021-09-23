import { Task } from 'redux-saga'
import { call, cancel, fork, put, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { actions as coreActions, actionTypes } from 'data'

import profileSagas from '../../modules/profile/sagas'
import sagas from './sagas'
import { actions } from './slice'

let pollTask: Task

export default ({ api, coreSagas, networks }) => {
  const simpleBuySagas = sagas({ api, coreSagas, networks })
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  return function* simpleBuySaga() {
    yield takeEvery(actionTypes.form.CHANGE, simpleBuySagas.formChanged)
    yield takeLatest(actions.activateCard.type, simpleBuySagas.activateSBCard)
    yield takeLatest(actions.addCard.type, simpleBuySagas.addCardDetails)
    yield takeLatest(actions.addCardFinished, simpleBuySagas.addCardFinished)
    yield takeLatest(actions.cancelOrder.type, simpleBuySagas.cancelSBOrder)
    yield takeLatest(actions.createOrder.type, simpleBuySagas.createSBOrder)
    yield takeLatest(actions.confirmFundsOrder, simpleBuySagas.confirmSBFundsOrder)
    yield takeLatest(actions.confirmOrderPoll.type, simpleBuySagas.confirmOrderPoll)
    yield takeLatest(actions.confirmOrder.type, simpleBuySagas.confirmOrder)
    yield takeLatest(actions.fetchBalance.type, simpleBuySagas.fetchSBBalances)
    yield takeLatest(actions.deleteCard.type, simpleBuySagas.deleteSBCard)
    yield takeLatest(actions.fetchCard.type, simpleBuySagas.fetchSBCard)
    yield takeLatest(actions.fetchCards.type, simpleBuySagas.fetchSBCards)
    yield takeLatest(actions.fetchFiatEligible.type, simpleBuySagas.fetchSBFiatEligible)
    yield takeLatest(actions.fetchSDDEligibility.type, simpleBuySagas.fetchSDDEligible)
    yield takeLatest(actions.fetchSDDVerified.type, simpleBuySagas.fetchSDDVerified)
    yield takeLatest(actions.fetchLimits.type, simpleBuySagas.fetchLimits)
    yield takeLatest(actions.fetchOrders.type, simpleBuySagas.fetchSBOrders)
    yield takeLatest(actions.fetchPairs.type, simpleBuySagas.fetchSBPairs)
    yield takeLatest(actions.fetchPaymentAccount.type, simpleBuySagas.fetchSBPaymentAccount)
    yield takeLatest(actions.fetchPaymentMethods.type, simpleBuySagas.fetchSBPaymentMethods)
    yield takeLatest(actions.fetchQuote.type, simpleBuySagas.fetchSBQuote)
    yield takeLatest(actions.handleDepositFiatClick.type, simpleBuySagas.handleSBDepositFiatClick)
    yield takeLatest(actions.handleMethodChange.type, simpleBuySagas.handleSBMethodChange)
    yield takeLatest(actions.handleBuyMaxAmountClick.type, simpleBuySagas.handleBuyMaxAmountClick)
    yield takeLatest(actions.handleBuyMinAmountClick.type, simpleBuySagas.handleBuyMinAmountClick)
    yield takeLatest(actions.handleSellMaxAmountClick.type, simpleBuySagas.handleSellMaxAmountClick)
    yield takeLatest(actions.handleSellMinAmountClick.type, simpleBuySagas.handleSellMinAmountClick)
    yield takeLatest(actions.initializeBillingAddress.type, simpleBuySagas.initializeBillingAddress)
    yield takeLatest(actions.initializeCheckout.type, simpleBuySagas.initializeCheckout)
    yield takeLatest(actions.pollBalances.type, simpleBuySagas.pollSBBalances)
    yield takeLatest(actions.pollCard.type, simpleBuySagas.pollSBCard)
    yield takeLatest(actions.pollOrder.type, simpleBuySagas.pollSBOrder)
    yield takeLatest(actions.showModal.type, simpleBuySagas.showModal)
    yield takeLatest(actions.switchFix.type, simpleBuySagas.switchFix)

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
    yield takeLatest(actions.setStep.type, simpleBuySagas.setStepChange)
    // Refresh coin tx lists
    yield takeLatest(actions.fetchOrders.type, function* () {
      yield call(waitForUserData)
      yield put(coreActions.core.data.bch.fetchTransactions('', true))
      yield put(coreActions.core.data.btc.fetchTransactions('', true))
      yield put(coreActions.core.data.eth.fetchTransactions('', true))
      yield put(coreActions.core.data.eth.fetchErc20Transactions('pax', true))
      yield put(coreActions.core.data.eth.fetchErc20Transactions('usdt', true))
      yield put(coreActions.core.data.eth.fetchErc20Transactions('wdgld', true))
      yield put(coreActions.core.data.xlm.fetchTransactions('', true))
    })

    // used for sell only now, eventually buy as well
    // TODO: use swap2 quote for buy AND sell
    yield takeLatest(
      actions.startPollSellQuote.type,
      function* (payload: ReturnType<typeof actions.startPollSellQuote>) {
        if (pollTask && pollTask.isRunning()) yield cancel(pollTask)
        pollTask = yield fork(simpleBuySagas.fetchSellQuote, payload)
        yield take(actions.stopPollSellQuote.type)
        yield cancel(pollTask)
      }
    )
  }
}
