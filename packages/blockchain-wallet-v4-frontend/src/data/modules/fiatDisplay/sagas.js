import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as sagas from '../../sagas'

export const init = function * (action) {
  try {
    const { coin } = action.payload
    console.log(coin)
    switch (coin) {
      // case 'ETH': return yield put(actions.core.data.ethereum.fetchRates())
      default: return yield put(actions.core.data.bitcoin.fetchRates())
    }
  } catch (e) {
    console.log(e)
    yield put(actions.alerts.displayError('Could not init fiat display.'))
  }
}
export default function * () {
  yield takeLatest(AT.INIT_FIAT_DISPLAY, init)
}
