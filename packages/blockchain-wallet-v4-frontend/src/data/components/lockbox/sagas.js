import { call, put, race, select } from 'redux-saga/effects'
import { contains, keysIn } from 'ramda'
import Btc from '@ledgerhq/hw-app-btc'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as LockboxService from 'services/LockboxService'

const logLocation = 'components/lockbox/sagas'

export default ({ api, coreSagas }) => {
  // determines if lockbox is setup and routes app accordingly
  const determineLockboxRoute = function*() {
    try {
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const devices = devicesR.getOrElse({})

      keysIn(devices).length
        ? yield put(actions.router.push('/lockbox/dashboard'))
        : yield put(actions.router.push('/lockbox/onboard'))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'determineLockboxRoute', e)
      )
    }
  }
  // saves new device to KvStore
  const saveNewDeviceKvStore = function*(action) {
    try {
      const { deviceName } = action.payload
      yield put(A.saveNewDeviceKvStoreLoading())
      const newDeviceR = yield select(S.getNewDeviceInfo)
      const newDevice = newDeviceR.getOrFail('missing_device')
      const mdAccountsEntry = LockboxService.generateAccountsMDEntry(
        newDevice.info
      )
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(
          newDevice.id,
          newDevice.type,
          deviceName,
          mdAccountsEntry
        )
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.router.push('/lockbox/dashboard'))
      yield put(actions.core.data.bitcoin.fetchData())
      // reset new device setup to step 1
      yield put(A.changeDeviceSetupStep('setup-type'))
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
    } catch (e) {
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.alerts.displayError(C.LOCKBOX_SETUP_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'storeDeviceName', e))
    }
  }

  const updateDeviceBalanceDisplay = function*(action) {
    try {
      const { deviceID, showBalances } = action.payload
      yield put(A.updateDeviceBalanceDisplayLoading())
      yield put(
        actions.core.kvStore.lockbox.updateDeviceBalanceDisplay(
          deviceID,
          showBalances
        )
      )
      yield put(A.updateDeviceBalanceDisplaySuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_SUCCESS))
    } catch (e) {
      yield put(A.updateDeviceBalanceDisplayFailure())
      yield put(actions.alerts.displayError(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'updateDeviceBalanceDisplay',
          e
        )
      )
    }
  }

  // renames a device in KvStore
  const updateDeviceName = function*(action) {
    try {
      const { deviceID, deviceName } = action.payload
      yield put(A.updateDeviceNameLoading())
      yield put(
        actions.core.kvStore.lockbox.storeDeviceName(deviceID, deviceName)
      )
      yield put(A.updateDeviceNameSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_SUCCESS))
    } catch (e) {
      yield put(A.updateDeviceNameFailure())
      yield put(actions.alerts.displayError(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceName', e)
      )
    }
  }

  // deletes a device from KvStore
  const deleteDevice = function*(action) {
    try {
      const { deviceID } = action.payload
      yield put(A.deleteDeviceLoading())
      yield put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceID))
      yield put(actions.router.push('/lockbox'))
      yield put(A.deleteDeviceSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
    } catch (e) {
      yield put(A.deleteDeviceFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
      yield put(actions.alerts.displayError(C.LOCKBOX_DELETE_ERROR))
    }
  }

  // new device setup saga
  const initializeNewDeviceSetup = function*() {
    try {
      // 25 min timeout for setup
      const setupTimeout = 1500000
      // poll for both Ledger and Blockchain type devices
      const dashboardTransport = yield race({
        LEDGER: call(
          LockboxService.pollForAppConnection,
          'LEDGER',
          'DASHBOARD',
          setupTimeout
        ),
        BLOCKCHAIN: call(
          LockboxService.pollForAppConnection,
          'BLOCKCHAIN',
          'DASHBOARD',
          setupTimeout
        )
      })
      // dashboard detected, user has completed setup steps on device
      // determine the deviceType based on which channel returned
      const deviceType = keysIn(dashboardTransport)[0]
      yield put(A.changeDeviceSetupStep('open-btc-app'))
      const btcTransport = yield call(
        LockboxService.pollForAppConnection,
        deviceType,
        'BTC'
      )
      const btcConnection = new Btc(btcTransport)
      // derive device info such as chaincodes and xpubs
      const newDeviceInfo = yield call(
        LockboxService.derviveDeviceInfo,
        btcConnection
      )
      // derive a unique deviceId hashed from btc xpub
      const newDeviceId = yield call(
        LockboxService.deriveDeviceID,
        newDeviceInfo.btc
      )
      yield put(
        A.setNewDeviceInfo({
          id: newDeviceId,
          info: newDeviceInfo,
          type: deviceType
        })
      )
      const storedDevicesR = yield select(
        selectors.core.kvStore.lockbox.getDevices
      )
      const storedDevices = storedDevicesR.getOrElse({})
      // check if device has already been added
      if (contains(newDeviceId)(keysIn(storedDevices))) {
        yield put(A.changeDeviceSetupStep('duplicate-device'))
      } else {
        yield put(A.changeDeviceSetupStep('name-device'))
      }
    } catch (e) {
      // TODO: handle connection timeouts gracefully..
      window.alert('DEVICE CONNECTION TIMEOUT') // eslint-disable-line
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e)
      )
    }
  }

  /**
   * Polls for device connection and application to be opened
   * @param {String} action.app - Requested application to wait for
   * @param {String} action.deviceId - Unique device ID
   * @param {Number} [action.timeout] - Length of time in ms to wait for a connection
   * @returns {Action} Yields device connected action
   */
  const pollForDevice = function*(action) {
    try {
      const { appRequested, deviceId, timeout } = action.payload
      // reset previous connection status
      // TODO: maybe have consuming components contain and/or clean up their own connections state?
      yield put(A.resetConnectionStatus())
      const storedDevicesR = yield select(
        selectors.core.kvStore.lockbox.getDevices
      )
      const storedDevices = storedDevicesR.getOrElse({})
      const deviceType = storedDevices[deviceId].device_type

      // TODO: why doesnt programmatically creating race work?
      // let polls = {}
      // forEachObjIndexed((val, key) => {
      //   polls[key] = call(LockboxService.pollForAppConnection, deviceType, key, timeout)
      // }, LockboxService.CONSTS.SCRAMBLEKEYS[deviceType])
      // const deviceConnection = yield race(polls)

      // poll for device connection on all apps
      // TODO: this doesnt detect Ethereum app.. :(
      const deviceConnection = yield race({
        DASHBOARD: call(
          LockboxService.pollForAppConnection,
          deviceType,
          'DASHBOARD',
          timeout
        ),
        BTC: call(
          LockboxService.pollForAppConnection,
          deviceType,
          'BTC',
          timeout
        ),
        BCH: call(
          LockboxService.pollForAppConnection,
          deviceType,
          'BCH',
          timeout
        ),
        ETH: call(
          LockboxService.pollForAppConnection,
          deviceType,
          'ETH',
          timeout
        )
      })

      // device/app detected
      const detectedApp = keysIn(deviceConnection)[0]
      // console.info('DETECTED::', detectedApp)
      yield put(A.setDevicePresent(true))
      yield put(A.setCurrentDevice(deviceId))
      yield put(A.setCurrentApp(detectedApp))
      if (detectedApp !== appRequested) {
        // poll for requested app
        yield call(
          LockboxService.pollForAppConnection,
          deviceType,
          appRequested,
          timeout
        )
        yield put(A.setCurrentApp(appRequested))
      }
    } catch (e) {
      yield put(A.setConnectionError(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'connectDevice', e))
    }
  }

  return {
    deleteDevice,
    determineLockboxRoute,
    initializeNewDeviceSetup,
    pollForDevice,
    saveNewDeviceKvStore,
    updateDeviceName,
    updateDeviceBalanceDisplay
  }
}
