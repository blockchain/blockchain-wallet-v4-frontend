import { all, takeEvery, select, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
// import * as actions from '../actions'
import * as selectors from '../selectors'
// import { Exchange } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendBitcoinGoalSaga = function * (goal) {
    // const { id, data } = goal
    // const { amount, address, message } = data
    // // Goal work
    // const unit = yield select(selectors.core.settings.getBtcUnit)
    // const scaledAmount = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit }).value
    // yield call(sagas.modules.sendBitcoin.initSendBitcoin)
    // yield put(actions.form.startAsyncValidation('sendBitcoin'))
    // yield put(actions.form.change('sendBitcoin', 'to2', address))
    // yield put(actions.form.change('sendBitcoin', 'amount', scaledAmount))
    // yield put(actions.form.change('sendBitcoin', 'message', message))
    // yield put(actions.form.touch('sendBitcoin', 'to2', 'amount', 'message'))
    // // Goal removed from state
    // yield put(actions.goals.deleteGoal(id))
  }

  const goalSaga = function * () {
    const goals = yield select(selectors.goals.getGoals)

    yield all(goals.map((goal) => {
      switch (goal.name) {
        case 'payment': return call(sendBitcoinGoalSaga, goal)
      }
    }))
  }

  return function * () {
    yield takeEvery(AT.RUN_GOALS, goalSaga)
  }
}
