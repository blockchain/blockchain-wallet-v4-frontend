import { takeLatest } from 'redux-saga/effects'

import { actionTypes } from 'data'
import * as AT from './actionTypes'
import sagas from './exchange.sagas'

export default ({ api, coreSagas, networks }) => {
  const exchangeSagas = sagas({ api, coreSagas, networks })

  return function* exchangeSaga () {
    yield takeLatest(AT.INITIALIZE, exchangeSagas.exchangeFormInitialized)
    yield takeLatest(AT.CHANGE_SOURCE, exchangeSagas.changeSource)
    yield takeLatest(AT.CHANGE_TARGET, exchangeSagas.changeTarget)
    yield takeLatest(AT.CHANGE_AMOUNT, exchangeSagas.changeAmount)
    yield takeLatest(AT.CHANGE_FIX, exchangeSagas.changeFix)
    yield takeLatest(AT.CONFIRM_EXCHANGE, exchangeSagas.confirm)
    yield takeLatest(AT.CLEAR_SUBSCRIPTIONS, exchangeSagas.clearSubscriptions)
    yield takeLatest(AT.SWAP_BASE_AND_COUNTER, exchangeSagas.swapFieldValue)
    yield takeLatest(AT.UPDATE_LIMITS, exchangeSagas.updateLimits)
    yield takeLatest(
      actionTypes.modules.rates.PAIR_UPDATED,
      exchangeSagas.onQuoteChange
    )
    yield takeLatest(
      actionTypes.modules.rates.UPDATE_BEST_RATES,
      exchangeSagas.onBestRatesChange
    )
    yield takeLatest(AT.USE_MIN, exchangeSagas.useMin)
    yield takeLatest(AT.USE_MAX, exchangeSagas.useMax)
    yield takeLatest(
      AT.RECHECK_LATEST_TX,
      exchangeSagas.checkLatestTx.bind(null, 'ETH')
    )
    yield takeLatest(AT.SHOW_CONFIRMATION, exchangeSagas.showConfirmation)
  }
}
