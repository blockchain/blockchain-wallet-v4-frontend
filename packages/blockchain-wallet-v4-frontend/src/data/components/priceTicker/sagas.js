import { put, select } from 'redux-saga/effects'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { equals } from 'ramda'

export default ({ coreSagas }) => {
  const initialized = function * (action) {
    try {
      const { coin } = action.payload
      const bchRates = yield select(selectors.core.data.bitcoin.getRates)
      const btcRates = yield select(selectors.core.data.bch.getRates)
      const ethRates = yield select(selectors.core.data.ethereum.getRates)
      if (equals(coin, 'BCH') && Remote.NotAsked.is(bchRates)) { return yield put(actions.core.data.bch.fetchRates()) }
      if (equals(coin, 'BTC') && Remote.NotAsked.is(btcRates)) { return yield put(actions.core.data.bitcoin.fetchRates()) }
      if (equals(coin, 'ETH') && Remote.NotAsked.is(ethRates)) { return yield put(actions.core.data.ethereum.fetchRates()) }
    } catch (e) {
      yield put(actions.logs.logErrorMessage('components/priceTicker/sagas', 'coinClicked', 'Price index series chart could not be initialized.'))
    }
  }

  return {
    initialized
  }
}
