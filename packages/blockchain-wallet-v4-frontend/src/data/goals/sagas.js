import { all, takeEvery, takeLatest, select, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'
import * as actionTypes from '../actionTypes'
import { Exchange } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendBtcGoalSaga = function * (goal) {
    const { id, data } = goal
    const { amount, address, message } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = yield select(selectors.core.data.bitcoin.getRates)
    const fiat = Exchange.convertBitcoinToFiat({ value: amount, fromUnit: 'BTC', toCurrency: currency.data, rates: btcRates.data }).value
    // Goal work
    yield put(actions.modals.showModal('SendBitcoin', { to: address, message, amount: {coin: amount, fiat} }))
    // Goal removed from state
    yield put(actions.goals.deleteGoal(id))
  }

  const goalSaga = function * () {
    const goals = yield select(selectors.goals.getGoals)

    yield all(goals.map((goal) => {
      switch (goal.name) {
        case 'payment': return takeLatest(actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS, sendBtcGoalSaga, goal)
      }
    }))
  }

  return function * () {
    yield takeEvery(AT.RUN_GOALS, goalSaga)
  }
}
