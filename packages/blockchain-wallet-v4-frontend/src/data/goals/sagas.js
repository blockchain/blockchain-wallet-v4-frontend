import { all, takeEvery, takeLatest, select, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'
import * as actionTypes from '../actionTypes'

export default ({ coreSagas }) => {
  const sendBtcGoalSaga = function * (goal) {
    const { id, data } = goal
    const { address, message } = data
    // Goal work
    const walletContext = yield select(selectors.core.wallet.getWalletContext)
    yield call(actions.core.data.bitcoin.fetchData, walletContext)
    yield put(actions.modals.showModal('SendBitcoin'))
    yield call(delay, 1500)
    yield put(actions.form.change('sendBtc', 'to', address))
    yield put(actions.form.change('sendBtc', 'message', message))
    // TODO: amount does not work, issue in passing to CoinConvertor
    // yield put(actions.form.change('sendBtc', 'amount', amount))
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
