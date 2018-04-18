import { call, put, takeEvery } from 'redux-saga/effects'
import { path } from 'ramda'
import * as AT from './actionTypes'
import { actions } from 'data'

export default ({ coreSagas }) => {
  const fetchTradeDetails = function * (action) {
    try {
      const trade = action.payload
      const depositAddress = path(['quote', 'deposit'], trade)
      yield call(coreSagas.kvStore.shapeShift.fetchShapeshiftTrade, depositAddress)
    } catch (e) {
      yield put(actions.alerts.displayError('Error fetching trade information'))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_TRADE_DETAILS, fetchTradeDetails)
  }
}
