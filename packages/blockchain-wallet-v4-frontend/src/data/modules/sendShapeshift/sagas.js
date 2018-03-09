import { takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
// import * as sagas from '../../sagas.js'
// import { askSecondPasswordEnhancer } from 'services/SagaService'
import settings from 'config'

// const refreshStatus = function * () {
//   console.log('refreshStatus')
// }

export const sendShapeshiftDeposit = function * (action) {
  try {
    const { coin, payment } = action.payload

    switch (coin) {
      case 'BTC': {
        const network = settings.NEWORK_BITCOIN
        const { selection } = payment
        console.log('Saga BTC', network, selection)
        // const saga = askSecondPasswordEnhancer(sagas.core.data.bitcoin.signAndPublish)
        // yield call(saga, { network, selection })
        break
      }
      case 'ETH': {
        const network = settings.NETWORK_ETHEREUM
        const { from, to, message, amount, gasPrice, gasLimit, nonce } = payment
        console.log('Saga ETH', network, from, to, message, amount, gasPrice, gasLimit, nonce)
        // const saga = askSecondPasswordEnhancer(sagas.core.data.ethereum.signAndPublish)
        // yield call(saga, { network, from, to, message, amount, gasPrice, gasLimit, nonce })
        break
      }
      // Update metadata with order details

      // Start polling saga to check the order status
    }

    yield put(actions.alerts.displaySuccess('Your deposit has been sent to ShapeShift.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Your deposit could not be sent.'))
  }
}

export default function * () {
  yield takeLatest(AT.SEND_SHAPESHIFT_DEPOSIT, sendShapeshiftDeposit)
}
