import { whereEq, map, isEmpty } from 'ramda'
import { put, all, call, select } from 'redux-saga/effects'
import { selectors, model } from 'data'
import * as A from './actions'

export default ({ api, ratesSocket }) => {
  const isSubscribeSuccess = whereEq(model.rates.SUBSCRIBE_SUCCESS_MESSAGE)

  const isSubscribeError = whereEq(model.rates.SUBSCRIBE_ERROR_MESSAGE)

  const isUnsubscribeSuccess = whereEq(model.rates.UNSUBSCRIBE_SUCCESS_MESSAGE)

  const isQuotesMessage = whereEq(model.rates.QUOTES_MESSAGE)

  const send = ratesSocket.send.bind(ratesSocket)

  const onOpen = function*() {}

  const onMessage = function*({ payload: { message } }) {
    if (isSubscribeSuccess(message)) yield put(A.subscribeSuccess(message.pair))
    if (isUnsubscribeSuccess(message))
      yield put(A.unsubscribeSuccess(message.pair))
    if (isSubscribeError(message))
      yield put(A.subscribeError(message.pair, null))
    if (isQuotesMessage(message))
      yield put(A.updateQuote(message.pair, message.quote))
  }

  const restFallback = function*() {
    const pairs = yield select(selectors.modules.rates.getActivePairs)
    if (!isEmpty(pairs)) yield all(map(fetchRate, pairs))
  }

  const fetchRate = function*(pair) {
    try {
      const quote = yield call(api.fetchRates, pair)
      yield put(A.updateQuote(pair, quote))
    } catch (e) {
      yield put(A.subscribeError(pair, e))
    }
  }

  const onClose = function*(action) {}

  const openChannelForPairs = function ({ payload }) {
    const { pairs } = payload
    send(model.rates.getPairSubscribeMessage(pairs))
  }

  const closeChannelForPairs = function ({ payload }) {
    const { pairs } = payload
    send(model.rates.getPairUnsubscribeMessage(pairs))
  }

  return {
    onOpen,
    onMessage,
    onClose,
    restFallback,
    openChannelForPairs,
    closeChannelForPairs
  }
}
