import { actionTypes as formActionTypes } from 'redux-form'
import { takeEvery, takeLatest, fork } from 'redux-saga/effects'

import { actionTypes } from 'data'
import * as AT from './actionTypes'
import exchangeSagas from './exchange.sagas'
import shapeshiftSagas from './shapeshift.sagas'

const registerExchangeSagas = function*(exchange) {
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
}

const registerShapeshiftSagas = function*(shapeshift) {
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_INITIALIZED,
    shapeshift.firstStepInitialized
  )
  yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, shapeshift.swapClicked)
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED,
    shapeshift.minimumClicked
  )
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED,
    shapeshift.maximumClicked
  )
  yield takeLatest(
    AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED,
    shapeshift.firstStepSubmitClicked
  )
  yield takeLatest(
    AT.EXCHANGE_THIRD_STEP_INITIALIZED,
    shapeshift.thirdStepInitialized
  )
  yield takeLatest(
    AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED,
    shapeshift.secondStepSubmitClicked
  )
  yield takeLatest(
    AT.EXCHANGE_US_STATE_REGISTERED,
    shapeshift.usStateRegistered
  )
  yield takeLatest(AT.EXCHANGE_DESTROYED, shapeshift.destroyed)
  yield takeEvery(formActionTypes.CHANGE, shapeshift.change)
}

export default ({ api, coreSagas, options, networks }) => {
  const shapeshift = shapeshiftSagas({ api, coreSagas, options, networks })
  const exchange = exchangeSagas({ api, coreSagas, options, networks })

  return function*() {
    yield fork(registerShapeshiftSagas, shapeshift)
    yield fork(registerExchangeSagas, exchange)
  }
}
