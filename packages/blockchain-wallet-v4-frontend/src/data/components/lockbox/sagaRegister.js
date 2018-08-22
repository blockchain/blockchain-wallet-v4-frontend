import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(
      AT.INITIALIZE_NEW_DEVICE_SETUP,
      lockboxSagas.initializeNewDeviceSetup
    )
    yield takeLatest(
      AT.SAVE_NEW_DEVICE_KVSTORE,
      lockboxSagas.saveNewDeviceKvStore
    )
    yield takeLatest(
      AT.UPDATE_DEVICE_NAME,
      lockboxSagas.updateDeviceBalanceDisplay
    )
    yield takeLatest(
      AT.UPDATE_DEVICE_BALANCE_DISPLAY,
      lockboxSagas.updateDeviceName
    )
    yield takeLatest(AT.DELETE_DEVICE, lockboxSagas.deleteDevice)
  }
}
