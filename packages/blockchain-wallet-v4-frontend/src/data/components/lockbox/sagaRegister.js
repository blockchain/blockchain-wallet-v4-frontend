import { cancel, takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from 'data/actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function*() {
    const installAppSaga = yield takeLatest(
      AT.INSTALL_APPLICATION,
      lockboxSagas.installApplication
    )
    const deviceSetupSaga = yield takeLatest(
      AT.INITIALIZE_NEW_DEVICE_SETUP,
      lockboxSagas.initializeNewDeviceSetup
    )
    const firmwareInstallSaga = yield takeLatest(
      AT.UPDATE_DEVICE_FIRMWARE,
      lockboxSagas.updateDeviceFirmware
    )
    yield takeLatest(
      AT.UPDATE_TRANSACTION_LIST,
      lockboxSagas.updateTransactionList
    )
    yield takeLatest(
      AT.DETERMINE_LOCKBOX_ROUTE,
      lockboxSagas.determineLockboxRoute
    )
    yield takeLatest(
      AT.SAVE_NEW_DEVICE_KVSTORE,
      lockboxSagas.saveNewDeviceKvStore
    )
    yield takeLatest(AT.DELETE_DEVICE, lockboxSagas.deleteDevice)
    yield takeLatest(AT.POLL_FOR_DEVICE_APP, lockboxSagas.pollForDeviceApp)
    yield takeLatest(
      AT.CHECK_DEVICE_AUTHENTICITY,
      lockboxSagas.checkDeviceAuthenticity
    )
    yield takeLatest(
      AT.INSTALL_BLOCKCHAIN_APPS,
      lockboxSagas.installBlockchainApps
    )

    yield takeLatest(
      AT.UNINSTALL_APPLICATION,
      lockboxSagas.uninstallApplication
    )
    yield takeLatest(AT.INITIALIZE_DASHBOARD, lockboxSagas.initializeDashboard)
    yield takeEvery(actionTypes.modals.CLOSE_MODAL, function*() {
      yield [installAppSaga, firmwareInstallSaga, deviceSetupSaga].map(task =>
        cancel(task)
      )
    })
  }
}
