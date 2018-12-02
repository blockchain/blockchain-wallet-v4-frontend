import { takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'
import * as AT from './actionTypes'
import exchangeSagas from './exchange.sagas'

export default ({ api, coreSagas, networks }) => {
  const exchange = exchangeSagas({ api, coreSagas, networks })

  return function*() {
    yield takeLatest(AT.INITIALIZE, exchange.exchangeFormInitialized)
    yield takeLatest(AT.CHANGE_SOURCE, exchange.changeSource)
    yield takeLatest(AT.CHANGE_TARGET, exchange.changeTarget)
    yield takeLatest(AT.CHANGE_AMOUNT, exchange.changeAmount)
    yield takeLatest(AT.CHANGE_FIX, exchange.changeFix)
    yield takeLatest(AT.CONFIRM_EXCHANGE, exchange.confirm)
    yield takeLatest(AT.CLEAR_SUBSCRIPTIONS, exchange.clearSubscriptions)
    yield takeLatest(AT.SWAP_BASE_AND_COUNTER, exchange.swapFieldValue)
    yield takeLatest(AT.UPDATE_LIMITS, exchange.updateLimits)
    yield takeLatest(
      actionTypes.modules.rates.PAIR_UPDATED,
      exchange.onQuoteChange
    )
    yield takeLatest(
      actionTypes.modules.rates.UPDATE_BEST_RATES,
      exchange.onBestRatesChange
    )
    yield takeLatest(AT.USE_MIN, exchange.useMin)
    yield takeLatest(AT.USE_MAX, exchange.useMax)
    yield takeLatest(
      AT.RECHECK_LATEST_TX,
      exchange.checkLatestTx.bind(null, 'ETH')
    )
    yield takeLatest(AT.SHOW_CONFIRMATION, exchange.showConfirmation)
  }
}
