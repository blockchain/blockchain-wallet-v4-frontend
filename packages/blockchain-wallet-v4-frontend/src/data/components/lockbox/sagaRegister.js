import { call, race, take, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const lockboxSagas = sagas({ api, coreSagas })

  return function* lockboxSaga() {
    yield takeLatest(AT.INITIALIZE_NEW_DEVICE_SETUP, function* (...args) {
      yield race({
        cancel: take(AT.LOCKBOX_MODAL_CLOSE),
        task: call(lockboxSagas.initializeNewDeviceSetup, ...args)
      })
    })
    yield takeLatest(AT.FINALIZE_NEW_DEVICE_SETUP, function* (...args) {
      yield race({
        cancel: take([AT.LOCKBOX_MODAL_CLOSE, AT.SET_NEW_DEVICE_SETUP_STEP]),
        task: call(lockboxSagas.finalizeNewDeviceSetup, ...args)
      })
    })
    yield takeLatest(AT.POLL_FOR_DEVICE_APP, function* (...args) {
      yield race({
        cancel: take([AT.LOCKBOX_MODAL_CLOSE, AT.SET_NEW_DEVICE_SETUP_STEP]),
        task: call(lockboxSagas.pollForDeviceApp, ...args)
      })
    })
    yield takeLatest(AT.UPDATE_DEVICE_FIRMWARE, function* (...args) {
      yield race({
        cancel: take(AT.LOCKBOX_MODAL_CLOSE),
        task: call(lockboxSagas.updateDeviceFirmware, ...args)
      })
    })
    yield takeLatest(AT.ROUTE_NEW_DEVICE_DASHBOARD, lockboxSagas.routeNewDeviceToDashboard)
    yield takeLatest(AT.INSTALL_APPLICATION, lockboxSagas.installApplication)
    yield takeLatest(AT.UPDATE_TRANSACTION_LIST, lockboxSagas.updateTransactionList)
    yield takeLatest(AT.DETERMINE_LOCKBOX_ROUTE, lockboxSagas.determineLockboxRoute)
    yield takeLatest(AT.SAVE_NEW_DEVICE_KVSTORE, lockboxSagas.saveNewDeviceKvStore)
    yield takeLatest(AT.DELETE_DEVICE, lockboxSagas.deleteDevice)
    yield takeLatest(AT.UNINSTALL_APPLICATION, lockboxSagas.uninstallApplication)
    yield takeLatest(AT.INITIALIZE_APP_MANAGER, lockboxSagas.initializeAppManager)
    yield takeLatest(AT.INITIALIZE_DASHBOARD, lockboxSagas.initializeDashboard)
    yield takeLatest(AT.SAVE_COIN_MD, lockboxSagas.saveCoinMD)
  }
}
