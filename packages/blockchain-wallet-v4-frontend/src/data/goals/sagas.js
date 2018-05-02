import { all, select, call, put } from 'redux-saga/effects'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { Exchange } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendBitcoinGoalSaga = function * (goal) {
    const { id, data } = goal
    const { amount, address, message } = data
    // Goal work
    const scaledAmount = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: 'BTC' }).value
    yield put(actions.form.startAsyncValidation('sendBitcoin'))
    yield put(actions.form.change('sendBitcoin', 'to2', address))
    yield put(actions.form.change('sendBitcoin', 'amount', scaledAmount))
    yield put(actions.form.change('sendBitcoin', 'message', message))
    yield put(actions.form.touch('sendBitcoin', 'to2', 'amount', 'message'))
    yield put(actions.modals.showModal('SendBitcoin'))
    // Goal removed from state
    yield put(actions.goals.deleteGoal(id))
  }

  const runGoals = function * () {
    const goals = yield select(selectors.goals.getGoals)

    yield all(goals.map((goal) => {
      switch (goal.name) {
        case 'payment': return call(sendBitcoinGoalSaga, goal)
      }
    }))
  }

  return {
    runGoals
  }
}
