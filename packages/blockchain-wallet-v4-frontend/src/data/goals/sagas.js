import { all, takeEvery, select, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'

export default ({ coreSagas }) => {
  const sendBtcGoalSaga = function * (goal) {
    const { id, data } = goal
    const { amount, address, message } = data
    // Goal work
    yield put(actions.modals.showModal('SendBitcoin'))
    yield call(delay, 2000)
    yield put(actions.form.change('sendBtc', 'to', address))
    yield put(actions.form.change('sendBtc', 'amount', amount))
    yield put(actions.form.change('sendBtc', 'message', message))
    yield put(actions.form.touch('sendBtc', 'to', 'amount', 'message'))
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

  return function * () {
    yield takeEvery(AT.RUN_GOALS, goalSaga)
  }
}
