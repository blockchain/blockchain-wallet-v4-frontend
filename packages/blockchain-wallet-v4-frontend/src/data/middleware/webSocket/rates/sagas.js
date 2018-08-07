import { whereEq, map, isEmpty } from 'ramda'
import { put, all, call } from 'redux-saga/effects'
import * as A from './actions'

const isSubscribeSuccess = whereEq({
  channel: 'quotes',
  type: 'subscribed',
  sequenceNumber: 1
})

const isSubscribeError = whereEq({
  channel: 'quotes',
  type: 'error_during_subscription',
  sequenceNumber: 0
})

const isUnsubscribeSuccess = whereEq({
  channel: 'quotes',
  type: 'unsubscribed',
  sequenceNumber: 5
})

const isQuotesMessage = whereEq({
  channel: 'quotes',
  type: 'quote',
  sequenceNumber: 3
})

export default ({ api, ratesSocket }) => {
  const send = ratesSocket.send.bind(ratesSocket)

  const onOpen = function*() {}

  const onMessage = function*({ payload: { message } }) {
    if (isSubscribeSuccess(message)) yield put(A.subscribeSuccess(message.pair))
    if (isUnsubscribeSuccess(message))
      yield put(A.unsubscribeSuccess(message.pair))
    if (isSubscribeError(message)) yield put(A.subscribeError(message.pair))
    if (isQuotesMessage(message)) yield put(A.updateRates(message))
  }

  const restFallback = function*() {
    // const pairs = yield select(selectors.modules.rates.getActiveRates)
    const pairs = ['BTC-ETH']
    if (!isEmpty(pairs)) yield all(map(fetchRate, pairs))
  }

  const fetchRate = function*(pair) {
    try {
      const rate = yield call(api.fetchRates, pair)
      yield put(A.updateRates(rate))
    } catch (e) {
      yield put(A.subscribeError(pair))
    }
  }

  const onClose = function*(action) {}

  const openChannelForPairs = function ({ payload }) {
    const { pairs } = payload
    send({
      channel: 'quotes',
      operation: 'subscribe',
      params: {
        type: 'pairs',
        pairs
      }
    })
  }

  const closeChannelForPairs = function ({ payload }) {
    const { pairs } = payload
    send({
      channel: 'quotes',
      operation: 'UNSUBSCRIBE',
      params: {
        type: 'pairs',
        pairs
      }
    })
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
