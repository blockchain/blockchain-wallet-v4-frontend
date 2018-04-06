import { all, cancel, cancelled, call, fork, select, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { equals, is, path, prop } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors'
import { askSecondPasswordEnhancer } from 'services/SagaService'
import settings from 'config'

let refreshTradesTask

const updateTrade = function * (trade) {
  const metadataStatus = prop('status', trade)
  if (equals('complete', metadataStatus) || equals('failed', metadataStatus)) {
    return
  }
  const depositAddress = path(['quote', 'deposit'], trade)
  const data = yield call(sagas.core.data.shapeShift.fetchTradeStatus, depositAddress)
  const shapeshiftStatus = prop('status', data)
  if (!equals(shapeshiftStatus, metadataStatus)) {
    yield put(actions.core.kvStore.shapeShift.updateTradeStatusMetadataShapeshift(depositAddress, shapeshiftStatus))
  }
}

const refreshTrades = function * (selector) {
  try {
    while (true) {
      const selectedTrades = yield select(selector)
      const trades = selectedTrades.getOrElse([])
      if (is(Array, trades)) {
        yield all(trades.map(updateTrade))
      } else {
        yield call(updateTrade, trades)
      }

      yield call(delay, 10000)
    }
  } catch (e) {
    console.log('exception', e)
  } finally {
    if (yield cancelled()) {
      console.log('cancelled')
    }
  }
}

export const cancelRefreshShapeshiftTrades = function * () {
  yield cancel(refreshTradesTask)
}

export const sendShapeshiftDeposit = function * (action) {
  try {
    const { coin, payment, order } = action.payload
    const depositAddress = prop('deposit', order)
    let hashIn = ''

    switch (coin) {
      case 'BCH': {
        const network = settings.NETWORK_BCH
        const { selection } = payment
        const saga = askSecondPasswordEnhancer(sagas.core.data.bch.signAndPublish)
        hashIn = yield call(saga, { network, selection })
        break
      }
      case 'BTC': {
        const network = settings.NETWORK_BITCOIN
        const { selection } = payment
        const saga = askSecondPasswordEnhancer(sagas.core.data.bitcoin.signAndPublish)
        hashIn = yield call(saga, { network, selection })
        break
      }
      case 'ETH': {
        const network = settings.NETWORK_ETHEREUM
        const { fromIndex, to, message, amount, gasPrice, gasLimit, nonce } = payment
        const saga = askSecondPasswordEnhancer(sagas.core.data.ethereum.signAndPublish)
        hashIn = yield call(saga, { network, data: { fromIndex, to, message, amount, gasPrice, gasLimit, nonce } })
        break
      }
    }
    const trade = {
      hashIn,
      timestamp: new Date().getTime(),
      status: 'no_deposits',
      quote: {
        orderId: prop('orderId', order),
        quotedRate: prop('quotedRate', order),
        deposit: prop('deposit', order),
        minerFee: prop('minerFee', order),
        pair: prop('pair', order),
        depositAmount: prop('depositAmount', order),
        withdrawal: prop('withdrawal', order),
        withdrawalAmount: prop('withdrawalAmount', order)
      }
    }
    // Update metadata with order details
    yield put(actions.core.kvStore.shapeShift.addTradeMetadataShapeshift(trade))
    // Redirect to step 3
    yield put(actions.wizard.setStep('exchange', 3))
    // Start polling saga
    refreshTradesTask = yield fork(refreshTrades, selectors.core.kvStore.shapeShift.getTrade(depositAddress))
    // Display notification
    yield put(actions.alerts.displaySuccess('Your deposit has been sent to ShapeShift.'))
  } catch (e) {
    console.log(e)
    yield put(actions.alerts.displayError('Your deposit could not be sent.'))
  }
}

export const refreshShapeshiftTrades = function * () {
  try {
    refreshTradesTask = yield fork(refreshTrades, selectors.core.kvStore.shapeShift.getTrades)
  } catch (e) {
    throw e
  }
}

export default function * () {
  yield takeLatest(AT.SEND_SHAPESHIFT_DEPOSIT, sendShapeshiftDeposit)
  yield takeLatest(AT.REFRESH_SHAPESHIFT_TRADES, refreshShapeshiftTrades)
  yield takeLatest(AT.CANCEL_REFRESH_SHAPESHIFT_TRADES, cancelRefreshShapeshiftTrades)
}
