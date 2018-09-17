import { whereEq, map, isEmpty, isNil, values } from 'ramda'
import { put, all, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import moment from 'moment'

import { selectors, model, actions } from 'data'
import * as A from './actions'

export const socketAuthRetryDelay = 5000
const openChannels = {
  rates: {},
  advice: {}
}

export default ({ api, ratesSocket }) => {
  const isAuthError = whereEq(model.rates.AUTH_ERROR_MESSAGE)

  const isAdviceSubscribeSuccess = whereEq(
    model.rates.ADVICE_SUBSCRIBE_SUCCESS_MESSAGE
  )

  const isAdviceSubscribeError = whereEq(
    model.rates.ADVICE_SUBSCRIBE_ERROR_MESSAGE
  )

  const isAdviceUnsubscribeSuccess = whereEq(
    model.rates.ADVICE_UNSUBSCRIBE_SUCCESS_MESSAGE
  )

  const isAdviceMessage = whereEq(model.rates.ADVICE_MESSAGE)

  const isRatesSubscribeSuccess = whereEq(
    model.rates.RATES_SUBSCRIBE_SUCCESS_MESSAGE
  )

  const isRatesSubscribeError = whereEq(
    model.rates.RATES_SUBSCRIBE_ERROR_MESSAGE
  )

  const isRatesUnubscribeSuccess = whereEq(
    model.rates.RATES_UNSUBSCRIBE_SUCCESS_MESSAGE
  )

  const isRatesMessage = whereEq(model.rates.RATES_MESSAGE)

  const onOpen = function*() {
    yield call(authenticateSocket)
    yield call(reopenChannels)
  }

  const reopenChannels = function () {
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.rates))
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.advice))
  }

  const onMessage = function*({ payload: { message } }) {
    if (isAuthError(message)) {
      yield delay(socketAuthRetryDelay)
      yield call(authenticateSocket)
    }
    if (isAdviceSubscribeSuccess(message))
      yield put(A.adviceSubscribeSuccess(message.pair))
    if (isAdviceSubscribeError(message))
      yield put(A.adviceSubscribeError(message.pair, message.error))
    if (isAdviceUnsubscribeSuccess(message))
      yield put(A.adviceUnsubscribeSuccess(message.pair))
    if (isAdviceMessage(message))
      yield put(actions.modules.rates.updateAdvice(message.quote))
    if (isRatesSubscribeSuccess(message))
      yield put(A.ratesSubscribeSuccess(message.pairs))
    if (isRatesSubscribeError(message))
      yield put(A.ratesSubscribeError(message.pairs, message.error))
    if (isRatesUnubscribeSuccess(message))
      yield put(A.ratesUnsubscribeSuccess(message.pairs))
    if (isRatesMessage(message))
      yield put(actions.modules.rates.updateBestRates(message.rates))
  }

  const restFallback = function*() {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    if (!isEmpty(pairs)) yield all(map(fetchAdvice, pairs))
  }

  const authenticateSocket = function*() {
    const token = (yield select(
      selectors.modules.profile.getApiToken
    )).getOrElse('')
    ratesSocket.send(model.rates.getAuthMessage(token))
  }

  const fetchAdvice = function*({
    pair,
    config: { volume, fix, fiatCurrency }
  }) {
    try {
      const { error, ratio } = yield call(
        api.fetchAdvice,
        pair,
        volume,
        fix,
        fiatCurrency
      )
      if (error) throw error
      yield put(
        actions.modules.rates.updateAdvice({
          pair,
          fix,
          volume,
          fiatCurrency,
          currencyRatio: ratio,
          time: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
        })
      )
    } catch (e) {
      yield put(A.adviceSubscribeError(pair, e))
    }
  }

  const onClose = function*(action) {}

  const openRatesChannel = function ({ payload }) {
    const { pairs } = payload
    if (ratesSocket.isReady()) {
      const message = model.rates.getRatesSubscribeMessage(pairs)
      openChannels.rates[pairs] = message
      return ratesSocket.send(message)
    }
  }

  const closeRatesChannel = function ({ payload }) {
    openChannels.rates = {}

    if (ratesSocket.isReady()) {
      ratesSocket.send(model.rates.getRatesUnsubscribeMessage())
    }
  }

  const openAdviceChannel = function*({ payload }) {
    const { pair, volume, fix, fiatCurrency } = payload
    if (isNil(volume) || !fix || !fiatCurrency) return
    if (ratesSocket.isReady()) {
      const message = model.rates.getAdviceSubscribeMessage(
        pair,
        volume,
        fix,
        fiatCurrency
      )
      openChannels.advice[pair] = message
      return ratesSocket.send(message)
    }
    yield call(fetchAdvice, { pair, config: { volume, fix, fiatCurrency } })
  }

  const closeAdviceChannel = function ({ payload }) {
    const { pair } = payload
    delete openChannels.advice[pair]
    if (ratesSocket.isReady())
      ratesSocket.send(model.rates.getAdviceUnsubscribeMessage(pair))
  }

  return {
    authenticateSocket,
    onOpen,
    onMessage,
    onClose,
    restFallback,
    openAdviceChannel,
    closeAdviceChannel,
    openRatesChannel,
    closeRatesChannel
  }
}
