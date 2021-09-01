import moment from 'moment'
import {
  both,
  complement,
  compose,
  either,
  has,
  indexBy,
  isEmpty,
  isNil,
  map,
  prop,
  unnest,
  values,
  whereEq
} from 'ramda'
import { all, call, delay, put, select } from 'redux-saga/effects'

import { actions, model, selectors } from 'data'

import * as A from './actions'

export const socketAuthRetryDelay = 5000
const openChannels = {
  advice: {},
  rates: {}
}

export default ({ api, ratesSocket }) => {
  const isAuthError = whereEq(model.rates.AUTH_ERROR_MESSAGE)

  const isAdviceSubscribeSuccess = whereEq(model.rates.ADVICE_SUBSCRIBE_SUCCESS_MESSAGE)

  const isAdviceSubscribeError = either(
    whereEq(model.rates.ADVICE_SUBSCRIBE_ERROR_MESSAGE),
    both(whereEq(model.rates.ADVICE_UPDATED_MESSAGE), has('error'))
  )

  const isAdviceUnsubscribeSuccess = whereEq(model.rates.ADVICE_UNSUBSCRIBE_SUCCESS_MESSAGE)

  const isAdviceMessage = both(
    either(
      whereEq(model.rates.ADVICE_UPDATED_MESSAGE),
      whereEq(model.rates.ADVICE_SNAPSHOT_MESSAGE)
    ),
    complement(has('error'))
  )

  const isRatesSubscribeSuccess = whereEq(model.rates.RATES_SUBSCRIBE_SUCCESS_MESSAGE)

  const isRatesSubscribeError = whereEq(model.rates.RATES_SUBSCRIBE_ERROR_MESSAGE)

  const isRatesUnubscribeSuccess = whereEq(model.rates.RATES_UNSUBSCRIBE_SUCCESS_MESSAGE)

  const isRatesMessage = either(
    whereEq(model.rates.RATES_UPDATED_MESSAGE),
    whereEq(model.rates.RATES_SNAPSHOT_MESSAGE)
  )

  const onOpen = function* () {
    yield call(authenticateSocket)
    yield call(reopenChannels)
  }

  const reopenChannels = function () {
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.rates))
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.advice))
  }

  const onMessage = function* ({ payload: { message } }) {
    if (isAuthError(message)) {
      yield delay(socketAuthRetryDelay)
      yield call(authenticateSocket)
    }
    if (isAdviceSubscribeSuccess(message)) yield put(A.adviceSubscribeSuccess(message.pair))
    if (isAdviceSubscribeError(message))
      yield put(A.adviceSubscribeError(message.pair, message.error))
    if (isAdviceUnsubscribeSuccess(message)) yield put(A.adviceUnsubscribeSuccess(message.pair))
    if (isAdviceMessage(message)) yield put(actions.modules.rates.updateAdvice(message.quote))
    if (isRatesSubscribeSuccess(message)) yield put(A.ratesSubscribeSuccess(message.pairs))
    if (isRatesSubscribeError(message))
      yield put(A.ratesSubscribeError(message.pairs, message.error))
    if (isRatesUnubscribeSuccess(message)) yield put(A.ratesUnsubscribeSuccess(message.pairs))
    if (isRatesMessage(message))
      yield put(actions.modules.rates.updateBestRates(indexBy(prop('pair'), message.rates)))
  }

  const restFallback = function* () {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    if (!isEmpty(pairs)) {
      yield all(
        unnest(
          map((pair) => {
            const pairs = model.rates.getBestRatesPairs(
              ...model.rates.splitPair(pair.pair),
              pair.config.fiatCurrency
            )
            return [fetchAdvice(pair), fetchRates(pairs)]
          }, pairs)
        )
      )
    }
  }

  const authenticateSocket = function* () {
    const token = (yield select(selectors.modules.profile.getApiToken)).getOrElse('')
    ratesSocket.send(model.rates.getAuthMessage(token))
  }

  const fetchAdvice = function* ({ config: { fiatCurrency, fix, volume }, pair }) {
    try {
      const { error, ratio } = yield call(api.fetchAdvice, pair, volume, fix, fiatCurrency)
      if (error) throw error
      yield put(
        actions.modules.rates.updateAdvice({
          currencyRatio: ratio,
          fiatCurrency,
          fix,
          pair,
          time: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
          volume
        })
      )
    } catch (e) {
      yield put(A.adviceSubscribeError(pair, e))
    }
  }

  const fetchRates = function* (pairs) {
    try {
      const { rates } = yield call(api.fetchBestRates, pairs)
      yield put(
        actions.modules.rates.updateBestRates(
          compose(
            indexBy(prop('pair')),
            map(({ symbol, value }) => ({ pair: symbol, price: value }))
          )(rates)
        )
      )
    } catch (e) {
      yield put(A.ratesSubscribeError(pairs, e))
    }
  }

  const onClose = function* (action) {}

  const openRatesChannel = function* ({ payload }) {
    const { pairs } = payload
    if (ratesSocket.isReady()) {
      const message = model.rates.getRatesSubscribeMessage(pairs)
      openChannels.rates[pairs] = message
      return ratesSocket.send(message)
    }
    yield call(fetchRates, pairs)
  }

  const closeRatesChannel = function ({ payload }) {
    openChannels.rates = {}

    if (ratesSocket.isReady()) {
      ratesSocket.send(model.rates.getRatesUnsubscribeMessage())
    }
  }

  const openAdviceChannel = function* ({ payload }) {
    const { fiatCurrency, fix, pair, volume } = payload
    if (isNil(volume) || !fix || !fiatCurrency) return
    if (ratesSocket.isReady()) {
      const message = model.rates.getAdviceSubscribeMessage(pair, volume, fix, fiatCurrency)
      openChannels.advice[pair] = message
      return ratesSocket.send(message)
    }
    yield call(fetchAdvice, { config: { fiatCurrency, fix, volume }, pair })
  }

  const closeAdviceChannel = function ({ payload }) {
    const { pair } = payload
    delete openChannels.advice[pair]
    if (ratesSocket.isReady()) ratesSocket.send(model.rates.getAdviceUnsubscribeMessage(pair))
  }

  return {
    authenticateSocket,
    closeAdviceChannel,
    closeRatesChannel,
    onClose,
    onMessage,
    onOpen,
    openAdviceChannel,
    openRatesChannel,
    restFallback
  }
}
