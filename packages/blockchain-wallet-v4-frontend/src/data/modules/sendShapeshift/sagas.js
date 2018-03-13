import { cancel, cancelled, call, fork, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { prop } from 'ramda'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'
import settings from 'config'

let updateTradeStatusTask

const updateTradeStatus = function * (depositAddress) {
  try {
    while (true) {
      yield call(delay, 3000)
      yield put(actions.core.data.shapeShift.fetchTradeStatus(depositAddress))
    }
  } catch (e) {
    console.log('exception', e)
  } finally {
    if (yield cancelled()) {
      console.log('cancelled')
    }
  }
}

export const cancelUpdateTradeStatus = function * () {
  yield cancel(updateTradeStatusTask)
}

export const sendShapeshiftDeposit = function * (action) {
  try {
    const { coin, payment, order } = action.payload
    const depositAddress = prop('deposit', order)
    let hashIn = ''

    console.log('sendShapeshiftDeposit', coin, payment, order, depositAddress)
    switch (coin) {
      case 'BTC': {
        const network = settings.NETWORK_BITCOIN
        const { selection } = payment
        console.log('Saga BTC', network, selection)
        const saga = askSecondPasswordEnhancer(sagas.core.data.bitcoin.signAndPublish)
        hashIn = yield call(saga, { network, selection })
        console.log('hashIn', hashIn)
        break
      }
      case 'ETH': {
        // const network = settings.NETWORK_ETHEREUM
        // const { from, to, message, amount, gasPrice, gasLimit, nonce } = payment
        // console.log('Saga ETH', network, from, to, message, amount, gasPrice, gasLimit, nonce)
        // const saga = askSecondPasswordEnhancer(sagas.core.data.ethereum.signAndPublish)
        // hashIn = yield call(saga, { network, from, to, message, amount, gasPrice, gasLimit, nonce })
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
    console.log(trade)

    // Update metadata with order details
    yield put(actions.core.kvStore.shapeShift.addTradeMetadataShapeshift(trade))
    // Redirect to step 3
    yield put(actions.wizard.setStep('exchange', 3))
    // Start polling saga
    updateTradeStatusTask = yield fork(updateTradeStatus, depositAddress)
    // Display notification
    yield put(actions.alerts.displaySuccess('Your deposit has been sent to ShapeShift.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Your deposit could not be sent.'))
  }
}

export default function * () {
  yield takeLatest(AT.SEND_SHAPESHIFT_DEPOSIT, sendShapeshiftDeposit)
}
