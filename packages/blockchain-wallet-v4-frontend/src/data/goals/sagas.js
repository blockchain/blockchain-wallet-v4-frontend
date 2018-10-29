import { select, put, take, call } from 'redux-saga/effects'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import * as selectors from '../selectors'
import { model } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const logLocation = 'goals/sagas'

  const sendBtcGoalSaga = function*(goal) {
    const { id, data } = goal
    const { amount, address, description } = data
    const currency = yield select(selectors.core.settings.getCurrency)
    const btcRates = yield select(selectors.core.data.bitcoin.getRates)
    const fiat = Exchange.convertBitcoinToFiat({
      value: amount,
      fromUnit: 'BTC',
      toCurrency: currency.getOrElse(null),
      rates: btcRates.getOrElse(null)
    }).value
    // Goal work
    yield put(
      actions.modals.showModal(model.components.sendBtc.MODAL, {
        to: address,
        description,
        amount: { coin: amount, fiat }
      })
    )
    // Goal removed from state
    yield put(actions.goals.deleteGoal(id))
  }

  const sunRiverGoalSaga = function*() {
    yield put(actions.modals.showModal('AirdropWelcome'))
    // do not delete goal, the welcomeSaga will check for this goal
    // if it exists, it wont show wallet welcome and will delete this goal via id
  }

  const runGoals = function*() {
    const goals = yield select(selectors.goals.getGoals)
    try {
      yield* goals.map(function*(goal) {
        switch (goal.name) {
          case 'payment':
            yield take(actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS)
            yield call(sendBtcGoalSaga, goal)
            break
          case 'airdrop':
            yield take(actionTypes.auth.LOGIN_SUCCESS)
            yield call(sunRiverGoalSaga, goal)
            break
        }
      })
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'runGoals', error))
    }
  }

  return {
    runGoals
  }
}
