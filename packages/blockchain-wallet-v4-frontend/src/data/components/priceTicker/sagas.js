import { put } from 'redux-saga/effects'
import * as actions from '../../actions'

export default ({ coreSagas }) => {
  const initialized = function * (action) {
    const { coin } = action.payload

    switch (coin) {
      case 'BCH': return yield put(actions.core.data.bch.fetchRates())
      case 'BTC': return yield put(actions.core.data.bitcoin.fetchRates())
      case 'ETH': return yield put(actions.core.data.ethereum.fetchRates())
      default: yield put(actions.logs.logErrorMessage('components/priceTicker/sagas', 'coinClicked', 'Price index series chart could not be initialized.'))
    }
  }

  return {
    initialized
  }
}
