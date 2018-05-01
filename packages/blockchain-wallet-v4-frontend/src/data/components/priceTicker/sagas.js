import { takeEvery, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions'

export default ({ coreSagas }) => {
  const initialized = function * (action) {
    try {
      const { coin } = action.payload
      switch (coin) {
        case 'BCH': return yield put(actions.core.data.bch.fetchRates())
        case 'BTC': return yield put(actions.core.data.bitcoin.fetchRates())
        case 'ETH': return yield put(actions.core.data.ethereum.fetchRates())
        default: throw new Error(`Could not fetch rates for coin ${coin}.`)
      }
    } catch (e) {
      // yield put(actions.alerts.displayError('Price index series chart could not be initialized.'))
    }
  }

  return {
    initialized
  }
}
