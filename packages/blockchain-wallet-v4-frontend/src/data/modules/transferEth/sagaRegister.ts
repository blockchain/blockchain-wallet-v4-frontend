import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './transferEthSlice'

export default ({ coreSagas, networks }) => {
  const transferEthSagas = sagas({ coreSagas, networks })

  return function* transferEthSaga() {
    yield takeLatest(actions.confirmTransferEth, transferEthSagas.confirmTransferEth)
    yield takeLatest(actions.transferEthInitialized, transferEthSagas.transferEthInitialized)
  }
}
