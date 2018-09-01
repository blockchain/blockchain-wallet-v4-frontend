import { whereEq, map, isEmpty, isNil, values } from 'ramda'
import { put, all, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { selectors, model, actions } from 'data'
import * as A from './actions'

export const socketAuthRetryDelay = 5000
const openChannels = {}

export default ({ api, ratesSocket }) => {
  const isAuthError = whereEq(model.rates.AUTH_ERROR_MESSAGE)

  const isSubscribeSuccess = whereEq(model.rates.SUBSCRIBE_SUCCESS_MESSAGE)

  const isSubscribeError = whereEq(model.rates.SUBSCRIBE_ERROR_MESSAGE)

  const isUnsubscribeSuccess = whereEq(model.rates.UNSUBSCRIBE_SUCCESS_MESSAGE)

  const isAdviceMessage = whereEq(model.rates.ADVICE_MESSAGE)

  const onOpen = function*() {
    yield call(authenticateSocket)
    yield call(reopenChannels)
  }

  const reopenChannels = function () {
    map(ratesSocket.send.bind(ratesSocket), values(openChannels))
  }

  const onMessage = function*({ payload: { message } }) {
    if (isAuthError(message)) {
      yield delay(socketAuthRetryDelay)
      yield call(authenticateSocket)
    }
    if (isSubscribeSuccess(message)) yield put(A.subscribeSuccess(message.pair))
    if (isUnsubscribeSuccess(message))
      yield put(A.unsubscribeSuccess(message.pair))
    if (isSubscribeError(message))
      yield put(A.subscribeError(message.pair, null))
    if (isAdviceMessage(message)) {
      yield put(
        actions.modules.rates.updateAdvice(
          message.pair,
          message.fix,
          message.volume,
          message.fiatCurrency,
          message.currencyRatio
        )
      )
    }
  }

  const restFallback = function*() {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    if (!isEmpty(pairs)) yield all(map(fetchRate, pairs))
  }

  const authenticateSocket = function*() {
    const token = (yield select(
      selectors.modules.profile.getApiToken
    )).getOrElse('')
    ratesSocket.send(model.rates.getAuthMessage(token))
  }

  const fetchRate = function*({ pair, config: { volume, fix, fiatCurrency } }) {
    try {
      const { ratio } = yield call(
        api.fetchRates,
        pair,
        volume,
        fix,
        fiatCurrency
      )
      yield put(
        actions.modules.rates.updateAdvice(
          pair,
          fix,
          volume,
          fiatCurrency,
          ratio
        )
      )
    } catch (e) {
      yield put(A.subscribeError(pair, e))
    }
  }

  const onClose = function*(action) {}

  const openChannelForPair = function*({ payload }) {
    const { pair, volume, fix, fiatCurrency } = payload
    if (isNil(volume) || !fix || !fiatCurrency) return
    if (ratesSocket.isReady()) {
      const message = model.rates.getPairSubscribeMessage(
        pair,
        volume,
        fix,
        fiatCurrency
      )
      openChannels[pair] = message
      return ratesSocket.send(message)
    }
    yield call(fetchRate, { pair, config: { volume, fix, fiatCurrency } })
  }

  const closeChannelForPair = function ({ payload }) {
    const { pair } = payload
    delete openChannels[pair]
    if (ratesSocket.isReady())
      ratesSocket.send(model.rates.getPairUnsubscribeMessage(pair))
  }

  return {
    authenticateSocket,
    onOpen,
    onMessage,
    onClose,
    restFallback,
    openChannelForPair,
    closeChannelForPair
  }
}
