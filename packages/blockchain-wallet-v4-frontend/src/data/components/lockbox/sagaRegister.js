import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.DEVICE_INFO_SUCCESS, lockboxSagas.deriveConnectStep)
    yield takeLatest(AT.INITIALIZE_CONNECT, lockboxSagas.initializeConnect)
    yield takeLatest(AT.ADD_DEVICE, lockboxSagas.addDevice)
  }
}
