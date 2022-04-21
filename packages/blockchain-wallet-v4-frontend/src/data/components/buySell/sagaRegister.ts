import { Task } from 'redux-saga'
import { call, cancel, fork, put, take, takeEvery, takeLatest } from 'redux-saga/effects'

import { actions as coreActions, actionTypes } from 'data'

import profileSagas from '../../modules/profile/sagas'
import sagas from './sagas'
import { actions } from './slice'

let buyPollTask: Task
let sellPollTask: Task

export default ({ api, coreSagas, networks }) => {
  const buySellSagas = sagas({ api, coreSagas, networks })
  const { waitForUserData } = profileSagas({ api, coreSagas, networks })

  return function* buySellSaga() {
    yield takeEvery(actionTypes.form.CHANGE, buySellSagas.formChanged)
    yield takeLatest(actions.registerCard, buySellSagas.registerBSCard)
    yield takeLatest(actions.activateCard.type, buySellSagas.activateBSCard)
    yield takeLatest(actions.cancelOrder.type, buySellSagas.cancelBSOrder)
    yield takeLatest(actions.createOrder.type, buySellSagas.createBSOrder)
    yield takeLatest(actions.confirmFundsOrder, buySellSagas.confirmBSFundsOrder)
    yield takeLatest(actions.confirmOrderPoll.type, buySellSagas.confirmOrderPoll)
    yield takeLatest(actions.confirmOrder.type, buySellSagas.confirmOrder)
    yield takeLatest(actions.fetchBalance.type, buySellSagas.fetchBSBalances)
    yield takeLatest(actions.deleteCard.type, buySellSagas.deleteBSCard)
    yield takeLatest(actions.createCard.type, buySellSagas.createBSCard)
    yield takeLatest(actions.fetchCards.type, buySellSagas.fetchBSCards)
    yield takeLatest(actions.fetchFiatEligible.type, buySellSagas.fetchFiatEligible)
    yield takeLatest(actions.fetchSDDEligibility.type, buySellSagas.fetchSDDEligible)
    yield takeLatest(actions.fetchSDDVerified.type, buySellSagas.fetchSDDVerified)
    yield takeLatest(actions.fetchLimits.type, buySellSagas.fetchLimits)
    yield takeLatest(actions.fetchPairs.type, buySellSagas.fetchBSPairs)
    yield takeLatest(actions.fetchPaymentAccount.type, buySellSagas.fetchPaymentAccount)
    yield takeLatest(actions.fetchPaymentMethods.type, buySellSagas.fetchPaymentMethods)
    yield takeLatest(actions.fetchQuote.type, buySellSagas.fetchBSQuote)
    yield takeLatest(actions.handleDepositFiatClick.type, buySellSagas.handleBSDepositFiatClick)
    yield takeLatest(actions.handleMethodChange.type, buySellSagas.handleBSMethodChange)
    yield takeLatest(actions.handleBuyMaxAmountClick.type, buySellSagas.handleBuyMaxAmountClick)
    yield takeLatest(actions.handleBuyMinAmountClick.type, buySellSagas.handleBuyMinAmountClick)
    yield takeLatest(actions.handleSellMaxAmountClick.type, buySellSagas.handleSellMaxAmountClick)
    yield takeLatest(actions.handleSellMinAmountClick.type, buySellSagas.handleSellMinAmountClick)
    yield takeLatest(actions.initializeBillingAddress.type, buySellSagas.initializeBillingAddress)
    yield takeLatest(actions.initializeCheckout.type, buySellSagas.initializeCheckout)
    yield takeLatest(actions.pollBalances.type, buySellSagas.pollBSBalances)
    yield takeLatest(actions.pollCard.type, buySellSagas.pollBSCard)
    yield takeLatest(actions.pollOrder.type, buySellSagas.pollBSOrder)
    yield takeLatest(actions.showModal.type, buySellSagas.showModal)
    yield takeLatest(actions.switchFix.type, buySellSagas.switchFix)
    yield takeLatest(actions.setFiatTradingCurrency.type, buySellSagas.setFiatTradingCurrency)
    yield takeLatest(actions.fetchCrossBorderLimits.type, buySellSagas.fetchCrossBorderLimits)
    yield takeLatest(actions.fetchAccumulatedTrades.type, buySellSagas.fetchAccumulatedTrades)

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
