import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.DEVICE_INFO_SUCCESS, lockboxSagas.deriveConnectStep)
    yield takeLatest(AT.INITIALIZE_CONNECT, lockboxSagas.initializeConnect)
    yield takeLatest(AT.STORE_DEVICE_NAME, lockboxSagas.storeDeviceName)
    yield takeLatest(
      AT.STORE_DEVICE_BACKUP_FLAG,
      lockboxSagas.storeDeviceBackupFlag
    )
    yield takeLatest(AT.STORE_DEVICE_ACCOUNTS, lockboxSagas.storeDeviceAccounts)
    yield takeLatest(AT.DELETE_DEVICE, lockboxSagas.deleteDevice)
  }
}
