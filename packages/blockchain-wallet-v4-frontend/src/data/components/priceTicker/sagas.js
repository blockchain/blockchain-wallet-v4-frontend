import { put, select } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'

import * as actions from '../../actions'
import * as selectors from '../../selectors'

export default ({ coreSagas }) => {
  const initialized = function * (action) {
    try {
      const bchRates = yield select(selectors.core.data.btc.getRates)
      const btcRates = yield select(selectors.core.data.bch.getRates)
      const ethRates = yield select(selectors.core.data.eth.getRates)
      const xlmRates = yield select(selectors.core.data.xlm.getRates)
      if (Remote.NotAsked.is(bchRates)) {
        yield put(actions.core.data.bch.fetchRates())
      }
      if (Remote.NotAsked.is(btcRates)) {
        yield put(actions.core.data.btc.fetchRates())
      }
      if (Remote.NotAsked.is(ethRates)) {
        yield put(actions.core.data.eth.fetchRates())
      }
      if (Remote.NotAsked.is(xlmRates)) {
        yield put(actions.core.data.xlm.fetchRates())
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'components/priceTicker/sagas',
          'coinClicked',
          'Price index series chart could not be initialized.'
        )
      )
    }
  }

  return {
    initialized
  }
}
