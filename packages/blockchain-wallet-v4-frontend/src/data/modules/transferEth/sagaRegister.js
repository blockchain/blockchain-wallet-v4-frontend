import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas, networks }) => {
  const transferEthSagas = sagas({ coreSagas, networks })

  return function* transferEthSaga () {
    yield takeLatest(
      AT.CONFIRM_TRANSFER_ETH,
      transferEthSagas.confirmTransferEth
    )
  }
}
