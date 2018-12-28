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
import { put, all, call, select } from 'redux-saga/effects'
import moment from 'moment'

import { selectors, model, actions } from 'data'

const openChannels = {
  rates: {},
  advice: {}
}

export default ({ api, ratesSocket }) => {
  const isAdviceSubscribeError = both(
    whereEq(model.rates.ADVICE_UPDATED_MESSAGE),
    has('error')
  )

  const isAdviceMessage = both(
    either(
      whereEq(model.rates.ADVICE_UPDATED_MESSAGE),
      whereEq(model.rates.ADVICE_SNAPSHOT_MESSAGE)
    ),
    complement(has('error'))
  )

  const isRatesSubscribeError = whereEq(
    model.rates.RATES_SUBSCRIBE_ERROR_MESSAGE
  )

  const isRatesMessage = either(
    whereEq(model.rates.RATES_UPDATED_MESSAGE),
    whereEq(model.rates.RATES_SNAPSHOT_MESSAGE)
  )

  const onOpen = function*() {
    yield call(reopenChannels)
  }

  const reopenChannels = function () {
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.rates))
    map(ratesSocket.send.bind(ratesSocket), values(openChannels.advice))
  }

  const onMessage = function*({ payload: { message } }) {
    if (isAdviceSubscribeError(message))
      yield put(
        actions.modules.rates.setPairQuoteError(message.pair, message.error)
      )
    if (isAdviceMessage(message))
      yield put(actions.modules.rates.updateAdvice(message.quote))
    if (isRatesSubscribeError(message))
      yield put(
        actions.modules.rates.setBestRatesError(message.pairs, message.error)
      )
    if (isRatesMessage(message))
      yield put(
        actions.modules.rates.updateBestRates(
          indexBy(prop('pair'), message.rates)
        )
      )
  }

  const restFallback = function*() {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    if (!isEmpty(pairs)) {
      yield all(
        unnest(
          map(pair => {
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
      yield put(actions.modules.rates.setPairQuoteError(pair, e))
    }
  }

  const fetchRates = function*(pairs) {
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
      yield put(actions.modules.rates.setBestRatesError(pairs, e))
    }
  }

  const onClose = function*(action) {}

  const openRatesChannel = function*({ payload }) {
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
