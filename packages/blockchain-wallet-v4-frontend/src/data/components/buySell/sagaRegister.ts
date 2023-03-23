import { Task } from 'redux-saga'
import { cancel, fork, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'

import sagas from './sagas'
import { proceedToBuyConfirmation } from './sagas/proceedToBuyConfirmation'
import { proceedToSellConfirmation } from './sagas/proceedToSellConfirmation'
import { proceedToSellEnterAmount } from './sagas/proceedToSellEnterAmount'
import { returnToBuyEnterAmount } from './sagas/returnToBuyEnterAmount'
import { returnToCryptoSelection } from './sagas/returnToCryptoSelection'
import { returnToSellEnterAmount } from './sagas/returnToSellEnterAmount'
import { actions } from './slice'

let buyPollTask: Task
let sellPollTask: Task
let pollTaskPrice: Task

export default ({ api, coreSagas, networks }) => {
  const buySellSagas = sagas({ api, coreSagas, networks })

  return function* buySellSaga() {
    yield takeEvery(actionTypes.form.CHANGE, buySellSagas.formChanged)
    yield takeLatest(actions.registerCard, buySellSagas.registerCard)
    yield takeLatest(actions.activateCard.type, buySellSagas.activateCard)
    yield takeLatest(actions.createSellOrder.type, buySellSagas.createSellOrder)
    yield takeLatest(actions.cancelOrder.type, buySellSagas.cancelBuyOrder)
    yield takeLatest(actions.confirmFundsOrder.type, buySellSagas.confirmBSFundsOrder)
    yield takeLatest(actions.confirmOrderPoll.type, buySellSagas.confirmOrderPoll)
    yield takeLatest(actions.confirmOrder.type, buySellSagas.confirmOrder)
    yield takeLatest(actions.checkCardSuccessRate.type, buySellSagas.checkCardSuccessRate)
    yield takeLatest(actions.fetchBalance.type, buySellSagas.fetchBSBalances)
    yield takeLatest(actions.deleteCard.type, buySellSagas.deleteBSCard)
    yield takeLatest(actions.createCard.type, buySellSagas.createCard)
    yield takeLatest(actions.fetchCards.type, buySellSagas.fetchBSCards)
    yield takeLatest(actions.fetchFiatEligible.type, buySellSagas.fetchFiatEligible)
    yield takeLatest(actions.fetchLimits.type, buySellSagas.fetchLimits)
    yield takeLatest(actions.fetchPairs.type, buySellSagas.fetchPairs)
    yield takeLatest(actions.fetchPaymentAccount.type, buySellSagas.fetchPaymentAccount)
    yield takeLatest(actions.fetchPaymentMethods.type, buySellSagas.fetchPaymentMethods)
    yield takeLatest(actions.fetchQuote.type, buySellSagas.fetchBSQuote)
    yield takeLatest(actions.handleDepositFiatClick.type, buySellSagas.handleBSDepositFiatClick)
    yield takeLatest(actions.handleMethodChange.type, buySellSagas.handleMethodChange)
    yield takeLatest(actions.handleBuyMaxAmountClick.type, buySellSagas.handleBuyMaxAmountClick)
    yield takeLatest(actions.handleBuyMinAmountClick.type, buySellSagas.handleBuyMinAmountClick)
    yield takeLatest(actions.handleSellMaxAmountClick.type, buySellSagas.handleSellMaxAmountClick)
    yield takeLatest(actions.handleSellMinAmountClick.type, buySellSagas.handleSellMinAmountClick)
    yield takeLatest(actions.initializeBillingAddress.type, buySellSagas.initializeBillingAddress)
    yield takeLatest(actions.initializeCheckout.type, buySellSagas.initializeCheckout)
    yield takeLatest(actions.pollBalances.type, buySellSagas.pollBSBalances)
    yield takeLatest(actions.pollCard.type, buySellSagas.pollCard)
    yield takeLatest(actions.pollOrder.type, buySellSagas.pollOrder)
    yield takeLatest(actions.showModal.type, buySellSagas.showModal)
    yield takeLatest(actions.switchFix.type, buySellSagas.switchFix)
    yield takeLatest(actions.fetchCrossBorderLimits.type, buySellSagas.fetchCrossBorderLimits)
    yield takeLatest(actions.fetchAccumulatedTrades.type, buySellSagas.fetchAccumulatedTrades)
    yield takeLatest(actions.updateCardCvv.type, buySellSagas.updateCardCvv)
    yield takeLatest(actions.updateCardCvvAndPollOrder.type, buySellSagas.updateCardCvvAndPollOrder)
    yield takeLatest(actions.proceedToBuyConfirmation.type, proceedToBuyConfirmation)
    yield takeLatest(actions.proceedToSellConfirmation.type, proceedToSellConfirmation)
    yield takeLatest(actions.proceedToSellEnterAmount.type, proceedToSellEnterAmount)
    yield takeLatest(actions.returnToCryptoSelection.type, returnToCryptoSelection)
    yield takeLatest(actions.returnToBuyEnterAmount.type, returnToBuyEnterAmount)
    yield takeLatest(actions.returnToSellEnterAmount.type, returnToSellEnterAmount)

    // Fetch balances when profile/user is fetched
    yield takeLatest(
      [
        actionTypes.modules.profile.FETCH_USER_DATA_FAILURE,
        actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS,
        actionTypes.modules.profile.SET_API_TOKEN_FAILURE
      ],
      buySellSagas.fetchBSBalances
    )
    // Fetch balances and orders when step changes to order summary
    yield takeLatest(actions.setStep.type, buySellSagas.setStepChange)

    // TODO: there are two sagas running on actions.fetchOrders.type that is extremely expensive
    // we created a new temp lightweight action to fetch just the sb orders.
    // in future we need to decouple these so we can get just custodial or just non-custodial txs/orders
    yield takeLatest(actions.fetchBSOrders.type, buySellSagas.fetchBSOrders)
    yield takeLatest(actions.fetchOrders.type, buySellSagas.fetchBSOrders)

    yield takeLatest(
      actions.startPollSellQuotePrice.type,
      function* (payload: ReturnType<typeof actions.startPollSellQuotePrice>) {
        if (pollTaskPrice?.isRunning()) yield cancel(pollTaskPrice)
        pollTaskPrice = yield fork(buySellSagas.fetchSellQuotePrice, payload)
        yield take(actions.stopPollSellQuotePrice)
        yield cancel(pollTaskPrice)
      }
    )

    yield takeLatest(
      actions.startPollSellQuote.type,
      function* (payload: ReturnType<typeof actions.startPollSellQuote>) {
        if (sellPollTask?.isRunning()) yield cancel(sellPollTask)
        sellPollTask = yield fork(buySellSagas.fetchSellQuote, payload)
        yield take(actions.stopPollSellQuote.type)
        yield cancel(sellPollTask)
      }
    )

    yield takeLatest(
      actions.startPollBuyQuote.type,
      function* (payload: ReturnType<typeof actions.startPollBuyQuote>) {
        if (buyPollTask?.isRunning()) yield cancel(buyPollTask)
        buyPollTask = yield fork(buySellSagas.fetchBuyQuote, payload)
        yield take(actions.stopPollBuyQuote.type)
        yield cancel(buyPollTask)
      }
    )
  }
}
