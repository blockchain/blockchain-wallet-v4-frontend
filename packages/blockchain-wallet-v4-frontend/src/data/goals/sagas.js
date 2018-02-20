import { all, takeEvery, select, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'
import * as sagas from '../sagas'
import { Exchange } from 'blockchain-wallet-v4/src'

const sendBtcGoalSaga = function * (goal) {
  const { id, data } = goal
  const { amount, address, message } = data
  // Goal work
  const unit = yield select(selectors.core.settings.getBtcUnit)
  const scaledAmount = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit }).value
  yield call(sagas.modules.sendBtc.initSendBtc)
  yield put(actions.form.startAsyncValidation('sendBtc'))
  yield put(actions.form.change('sendBtc', 'to2', address))
  yield put(actions.form.change('sendBtc', 'amount', scaledAmount))
  yield put(actions.form.change('sendBtc', 'message', message))
  yield put(actions.form.touch('sendBtc', 'to2', 'amount', 'message'))
  // Goal removed from state
  yield put(actions.goals.deleteGoal(id))
}

const goalSaga = function * () {
  const goals = yield select(selectors.goals.getGoals)

  yield all(goals.map((goal) => {
    switch (goal.name) {
      case 'payment': return call(sendBtcGoalSaga, goal)
    }
  }))
}

export default function * () {
  yield takeEvery(AT.RUN_GOALS, goalSaga)
}
