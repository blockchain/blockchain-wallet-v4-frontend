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
import { getDeviceID, generateAccountsMDEntry } from 'services/LockboxService'

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
      const newDeviceID = getDeviceID(deviceInfo)
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
      const mdAccountsEntry = generateAccountsMDEntry(deviceInfo)
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

  // const pingForDevice = async function(transport) {
  //   debugger
  //   const test = transport.open()
  //   transport.send(Buffer.alloc(0), 100000, false, Buffer.alloc(1))
  //     .then((success) => {
  //       console.info('EXCHANGE SUCCESS', success)
  //     }, (error) => {
  //       console.info('EXCHANGE FAILURE', error)
  //     })
    // try {
    //   await attemptExchange(
    //     Buffer.alloc(0),
    //     openTimeout,
    //     false,
    //     Buffer.alloc(1)
    //   );
    // } catch (e) {
    //   const isU2FError = typeof e.metaData === "object";
    //   debugger
    // }
  // }

  const getFirmwareInfo = async function(transport) {
    return new Promise((success, failure) => {
      const APDUS = {
        GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
      }
      transport.send(...APDUS.GET_FIRMWARE).then((res) => {
        const byteArray = [...res]
        const data = byteArray.slice(0, byteArray.length - 2)
        const targetIdStr = Buffer.from(data.slice(0, 4))
        const targetId = targetIdStr.readUIntBE(0, 4)
        const seVersionLength = data[4]
        const seVersion = Buffer.from(data.slice(5, 5 + seVersionLength)).toString()
        const flagsLength = data[5 + seVersionLength]
        const flags = Buffer.from(
          data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength),
        ).toString()

        const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength]
        let mcuVersion = Buffer.from(
          data.slice(
            7 + seVersionLength + flagsLength,
            7 + seVersionLength + flagsLength + mcuVersionLength,
          ),
        )
        if (mcuVersion[mcuVersion.length - 1] === 0) {
          mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1)
        }
        mcuVersion = mcuVersion.toString()

        if (!seVersionLength) {
          success({
            targetId,
            seVersion: '0.0.0',
            flags: '',
            mcuVersion: '',
          })
        }
        success({ targetId, seVersion, flags, mcuVersion })
      }, (error) => {
        // TODO: loop for more pings...?
        failure(error)
      })
    })
  }

  const createDeviceListener = function () {
    console.log('start: createDeviceListener')
    return eventChannel(emitter => {
      async function startTransportListener () {
        try {
          console.info('start: startTransportListener')
          const transport = await openTransport()
          transport.setDebugMode((s) => {
            return console.info('CUSTOM LOGGER: ', s)
          })
          transport.setScrambleKey('B0L0S')
          transport.setExchangeTimeout(15000)
          console.info('transport:', transport)
          // await pingForDevice(transport)
          const firmwareInfo = await getFirmwareInfo(transport)
          console.info('firmwareInfo:', firmwareInfo)
          emitter(END)
        } catch (e) {
          throw new Error(e)
        }
      }

      startTransportListener()
      return () => {}
    })
  }

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

  const pollForConnectionStatus = function*() {
    try {
      console.log('start: pollForConnectionStatus')
      const listenerChannel = yield call(createDeviceListener)
      console.info('listenerChannel open')
      try {
        while (true) {
          const channelEnd = yield take(listenerChannel)
          console.info(channelEnd)
        }
      } finally {
        console.info('listenerChannel close')
        listenerChannel.close()
      }
    } catch (e) {
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
