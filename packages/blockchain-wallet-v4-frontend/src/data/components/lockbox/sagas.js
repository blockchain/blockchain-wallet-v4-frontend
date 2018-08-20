import { call, put, take, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { contains, keysIn } from 'ramda'
import Btc from '@ledgerhq/hw-app-btc'
import Eth from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport-u2f'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as LockboxService from 'services/LockboxService'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/lockbox/sagas'

  const deviceInfoChannel = function () {
    return eventChannel(emitter => {
      async function getDeviceInfo () {
        try {
          const transport = await Transport.create()

          const lockbox = new Btc(transport)

          // get public key and chaincode for btc and eth paths
          const btc = await lockbox.getWalletPublicKey("44'/0'/0'")
          const bch = await lockbox.getWalletPublicKey("44'/145'/0'")
          const eth = await lockbox.getWalletPublicKey("44'/60'/0'/0/0")
          emitter({ btc, bch, eth })
          emitter(END)
        } catch (e) {
          throw new Error(e)
        }
      }

      getDeviceInfo()
      return () => {}
    })
  }

  const initializeDeviceConnection = function*() {
    try {
      yield put(A.deviceInfoLoading())
      const chan = yield call(deviceInfoChannel)
      try {
        while (true) {
          const { btc, bch, eth } = yield take(chan)
          yield put(A.deviceInfoSuccess({ btc, bch, eth }))
        }
      } finally {
        chan.close()
      }
    } catch (e) {
      yield put(A.deviceInfoFailure(e))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'initializeDeviceConnection',
          e
        )
      )
    }
  }

  const deriveConnectStep = function*() {
    try {
      const deviceInfoR = yield select(S.getConnectedDevice)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const newDeviceID = LockboxService.getDeviceID(deviceInfo)
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const storedDevices = devicesR.getOrElse({})

      // check if device has already been added
      if (contains(newDeviceID)(keysIn(storedDevices))) {
        yield put(A.changeDeviceSetupStep('duplicate-device'))
      } else {
        yield put(A.setNewDeviceID(newDeviceID))
        yield put(A.changeDeviceSetupStep('name-device'))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveConnectStep', e)
      )
    }
  }

  const saveNewDeviceKvStore = function*() {
    try {
      yield put(A.saveNewDeviceKvStoreLoading())
      const deviceInfoR = yield select(S.getConnectedDevice)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      // derive device accounts and other information
      const mdAccountsEntry = lockboxService.generateAccountsMDEntry(deviceInfo)
      const deviceId = yield select(S.getNewDeviceSetupId)
      const deviceName = yield select(S.getNewDeviceSetupName)
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(
          deviceId,
          deviceName,
          mdAccountsEntry
        )
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
      yield put(actions.core.data.bitcoin.fetchData())
      // reset new device setup to step 1
      yield put(A.changeDeviceSetupStep('setup-type'))
    } catch (e) {
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_ERROR))
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
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'updateDeviceBalanceDisplay',
          e
        )
      )
    }
  }

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
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceName', e)
      )
    }
  }

  const deleteDevice = function*(action) {
    try {
      const { deviceID } = action.payload
      yield put(A.deleteDeviceLoading())
      yield put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceID))
      yield put(A.deleteDeviceSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
    } catch (e) {
      yield put(A.deleteDeviceFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
      yield put(actions.alerts.displayError(C.LOCKBOX_DELETE_ERROR))
    }
  }

  const pingForDevice = async function(transport) {
    return new Promise((success, failure) => {
      transport.send(...APDUS.NO_OP)
        .then((res) => success(res))
    })
  }

  const getFirmwareInfo = async function(transport) {
    return new Promise((success, failure) => {
      transport.send(...APDUS.GET_FIRMWARE).then((res) => {
        success(computeDeviceFirmware(res))
      }, (error) => {
        // TODO: loop for more pings...?
        failure(error)
      })
    })
  }

  const createDeviceConnection = function (requestedApp) {
    return new Promise((success, failure) => {
      function openTransport() {
        return new Promise((success, failure) => {
          Transport.open().then((transport) => {
            console.log('transport opened')
            console.info(transport)
            success(transport)
          }, (e) => {
            failure(e)
          })
        })
      }

      function pingDevice(transport) {
        return new Promise((success, failure) => {
          transport.send(...LockboxService.APDUS.NO_OP).finally(() => { success('device detected') })
        })
      }

      async function startTransportListener () {
        try {
          const transport = await openTransport()
          // TODO: what is appropriate length to listen for?
          transport.setExchangeTimeout(30000)
          // TODO: these event listeners dont seem to work
          transport.on("disconnect", (evt) => {
            console.info('DISCONNECTION NOTICE', evt)
          })
          transport.on("connect", (evt) => {
            console.info('CONNECTION NOTICE', evt)
          })

          // TODO: need to account for blockchain devices
          // default to dashboard connection
          transport.setScrambleKey(LockboxService.SCRAMBLEKEYS.LEDGER.DASHBOARD)
          if (requestedApp) transport.setScrambleKey(LockboxService.SCRAMBLEKEYS.LEDGER[requestedApp])
          const ping = await pingDevice(transport)
          success(ping)
        } catch (error) {
          failure(error)
        }
      }
      startTransportListener(success, failure)
    })
  }

  const pollForConnectionStatus = function*(action) {
    try {
      const { requestedApp } = action.payload
      // yield put(A.polling())
      const deviceConnection = yield call(createDeviceConnection, requestedApp)
      console.info(deviceConnection)
      // yield put(A.pollingDone())
    } catch (e) {
      // yield put(A.pollFail)
      yield put(
        actions.logs.logErrorMessage(logLocation, 'pollForConnectionStatus', e)
      )
    }
  }

  return {
    deleteDevice,
    deriveConnectStep,
    initializeDeviceConnection,
    saveNewDeviceKvStore,
    pollForConnectionStatus,
    updateDeviceName,
    updateDeviceBalanceDisplay
  }
}
