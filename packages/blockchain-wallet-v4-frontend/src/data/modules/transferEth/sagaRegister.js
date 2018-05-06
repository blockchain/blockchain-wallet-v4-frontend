import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const transferEthSagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.CONFIRM_TRANSFER_ETH, transferEthSagas.confirmTransferEth)
  }
}
