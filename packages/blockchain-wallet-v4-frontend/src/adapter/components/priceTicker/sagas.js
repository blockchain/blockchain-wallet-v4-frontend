import { select, takeEvery, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions.js'

const initialized = function* (action) {
  try {
    const { coin } = action.payload
    const currency = 'USD'
    switch (coin) {
      case 'BCH': yield put(actions.data.bch.fetchRates)
      case 'BCH': yield put(actions.data.btc.fetchRates)
      case 'BCH': yield put(actions.data.eth.fetchRates)
      default: throw new Error(`Could not fetch rates for coin ${coin}.`)
    }
  } catch (e) {
    // yield put(actions.alerts.displayError('Price index series chart could not be initialized.'))
  }
}

export default function* () {
  yield takeEvery(AT.PRICE_TICKER_INITIALIZED, initialized)
}
