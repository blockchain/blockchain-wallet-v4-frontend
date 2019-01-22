import { testSaga } from 'redux-saga-test-plan'

import { Remote, coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as CC from 'services/ConfirmService'
import * as S from './selectors'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors from '../../selectors'
import * as Lockbox from 'services/LockboxService'
import lockboxSagas from './sagas'
import * as SagaService from 'services/SagaService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
Lockbox.apps.installApp = jest.fn()
Lockbox.apps.uninstallApp = jest.fn()
Lockbox.utils.createBtcBchConnection = jest.fn()
Lockbox.utils.deriveDeviceInfo = jest.fn()
Lockbox.utils.getDeviceInfo = jest.fn()
Lockbox.utils.getXlmPublicKey = jest.fn()
Lockbox.firmware.checkDeviceAuthenticity = jest.fn()
SagaService.promptForLockbox = jest.fn()
SagaService.confirm = jest.fn()

const logLocation = 'components/lockbox/sagas'
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn(),
  getApplications: jest.fn(),
  getDeviceVersion: jest.fn(),
  getCurrentFirmware: jest.fn()
}
const coreSagas = coreSagasFactory({ api })
const newDeviceInfoMock = {
  info: {
    btc:
      'xpub6BwFGQ41Zi14LdeBtF42CBxaFeH84HBTAR9adRHbWWL53iTaRF5WNUzK2ojRQ3feH7Mx3bi2tAuBXV4qemaPrAAJjpUGgp3aAj3xVDMp8p2',
    bch:
      'xpub6DA9ziyDNzu88RYcoH2syDBUiwVhwHCgrf263Gmmy8qUugEtW7bu2ozPnMghcVv3y1ADEaRyubJxbh7vUBkm82vsc8g4FV1CJ9hH1nRN41E',
    eth:
      'xpub6Guyqw5vALdqVR6Q9NPqd4yGA2AhrLSfnTQjTKyd828E22PXirCwWzBiar1HUozAdF55f92Hzt9NXzf987PvejHrLfJgSgBzzdGaiqZui5b'
  },
  type: 'ledger'
}
const mdAccountsEntryMock = {
  device_type: 'ledger',
  device_name: 'My Lockbox',
  btc: {
    accounts: [
      {
        label: 'My Lockbox - BTC Wallet',
        archived: false,
        xpriv: '',
        xpub:
          'xpub6BwFGQ41Zi14LdeBtF42CBxaFeH84HBTAR9adRHbWWL53iTaRF5WNUzK2ojRQ3feH7Mx3bi2tAuBXV4qemaPrAAJjpUGgp3aAj3xVDMp8p2',
        address_labels: [],
        cache: {
          receiveAccount:
            'xpub6FCwXjnGhK52maoYmJJVCRAQiyLjgwAtsiysfbLzGiiPUhXyicYY5cXEjGAKQtycizjnu41kSapieBgG34Be156VFfbELNaWfpjs8TVJaR8',
          changeAccount:
            'xpub6FCwXjnGhK52mpqCeUUq8qSU6tVAto7YEEBjKwZ9v1AuMKaDCkiFVUVLpgREhARBzxUKiNk861gxxLHszJvKNvpdBLwuwy7cuztUGXn9FWP'
        }
      }
    ]
  },
  bch: {
    accounts: [
      {
        label: 'My Lockbox - BCH Wallet',
        archived: false,
        xpriv: '',
        xpub:
          'xpub6DA9ziyDNzu88RYcoH2syDBUiwVhwHCgrf263Gmmy8qUugEtW7bu2ozPnMghcVv3y1ADEaRyubJxbh7vUBkm82vsc8g4FV1CJ9hH1nRN41E',
        address_labels: [],
        cache: {
          receiveAccount:
            'xpub6DrGXJR2P1PBAN84JcE6mXHWYmr96gy9cJFFX1R4kf8TdvdwZKhUMKV86392FqDQvNn64Cw9E1hBQw8GaUCr7zDwbXTA5Q4CtuUzWTNC6JK',
          changeAccount:
            'xpub6DrGXJR2P1PBDnW4Y9RxPkuczQS6PSdCp8LixqbykLq8X5gSFsmgLRmPT3YTcUvnZnTYy1524JD1gQ8x6shubfHCJMP8y9CzmHnDKV6tMw9'
        }
      }
    ]
  },
  eth: {
    accounts: [
      {
        label: 'My Lockbox - ETH Wallet',
        archived: false,
        correct: true,
        addr: '0xd379c32a70A6e2D2698cA9890484340279e96DAA'
      }
    ],
    last_tx: null,
    last_tx_timestamp: null
  }
}

describe('lockbox sagas', () => {
  const {
    checkDeviceAuthenticity,
    deleteDevice,
    deriveLatestAppInfo,
    determineLockboxRoute,
    initializeNewDeviceSetup,
    initializeAppManager,
    installApplication,
    finalizeNewDeviceSetup,
    pollForDeviceAppChannel,
    pollForDeviceTypeChannel,
    routeNewDeviceToDashboard,
    saveCoinMD,
    saveNewDeviceKvStore,
    uninstallApplication,
    updateDeviceName,
    updateTransactionList
  } = lockboxSagas({
    api,
    coreSagas
  })

  describe('installApplication', () => {
    let payload = { appName: 'BTC' }
    const saga = testSaga(installApplication, { payload })
    const mockState = {
      transport: 'fakeTransport',
      targetId: 123,
      latestAppInfos: [{ name: 'BTC' }, { name: 'ETH' }],
      domains: {
        ledgerSocket: 'fakeUrl'
      }
    }

    it('should set app change status to loading', () => {
      saga.next().put(A.appChangeLoading())
    })
    it('should get transport from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('should get targetId from getDeviceTargetId', () => {
      saga.next({ transport: mockState.transport }).select(S.getDeviceTargetId)
    })
    it('should get latest appInfos from getLatestApplicationVersions', () => {
      saga
        .next(Remote.Success(mockState.targetId))
        .select(S.getLatestApplicationVersions)
    })
    it('should get socket domain', () => {
      saga
        .next(Remote.Success(mockState.latestAppInfos))
        .select(selectors.core.walletOptions.getDomains)
    })
    it('should call to install application', () => {
      saga
        .next(Remote.Success(mockState.domains))
        .call(
          Lockbox.apps.installApp,
          mockState.transport,
          mockState.domains.ledgerSocket,
          mockState.targetId,
          payload.appName,
          mockState.latestAppInfos
        )
    })
    it('should mark install success', () => {
      saga.next().put(A.appChangeSuccess(payload.appName, 'install'))
    })
  })

  describe('uninstallApplication', () => {
    let payload = { appName: 'BTC' }
    const saga = testSaga(uninstallApplication, { payload })
    const mockState = {
      transport: 'fakeTransport',
      targetId: 123,
      latestAppInfos: [{ name: 'BTC' }, { name: 'ETH' }],
      domains: {
        ledgerSocket: 'fakeUrl'
      }
    }

    it('should set app change status to loading', () => {
      saga.next().put(A.appChangeLoading())
    })
    it('should get transport from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('should get targetId from getDeviceTargetId', () => {
      saga.next({ transport: mockState.transport }).select(S.getDeviceTargetId)
    })
    it('should get latest appInfos from getLatestApplicationVersions', () => {
      saga
        .next(Remote.Success(mockState.targetId))
        .select(S.getLatestApplicationVersions)
    })
    it('should get socket domain', () => {
      saga
        .next(Remote.Success(mockState.latestAppInfos))
        .select(selectors.core.walletOptions.getDomains)
    })
    it('should call to uninstall application', () => {
      saga
        .next(Remote.Success(mockState.domains))
        .call(
          Lockbox.apps.uninstallApp,
          mockState.transport,
          mockState.domains.ledgerSocket,
          mockState.targetId,
          mockState.latestAppInfos[0]
        )
    })
    it('should mark uninstall success', () => {
      saga.next().put(A.appChangeSuccess(payload.appName, 'uninstall'))
    })
  })

  describe('checkDeviceAuthenticity', () => {
    const payload = { deviceIndex: 0 }
    const saga = testSaga(checkDeviceAuthenticity, { payload })
    const mockTransport = { timeout: 60 }
    const mockDeviceInfo = {
      providerId: 1,
      targetId: 2,
      fullVersion: '1.4.3'
    }
    const mockDeviceVersion = { id: 3 }
    const mockLedgerSocketUrl = 'wss://api.ledgerwallet.fakedotcom'
    const mockFirmware = { perso: 11 }

    it('should select deviceType from kvStore', () => {
      saga.next().select(selectors.core.kvStore.lockbox.getDevice, 0)
    })

    it('should poll for device dashboard', () => {
      saga
        .next(Remote.of({ device_type: 'ledger' }))
        .put(A.pollForDeviceApp('DASHBOARD', null, 'ledger'))
    })

    it('should take the device connection', () => {
      saga.next().take(AT.SET_CONNECTION_INFO)
    })

    it('should set checkDeviceAuthenticity to loading', () => {
      saga.next().put(A.checkDeviceAuthenticityLoading())
    })

    it('should get deviceType from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })

    it('should call to get base device info', () => {
      saga
        .next({ transport: mockTransport })
        .call(Lockbox.utils.getDeviceInfo, mockTransport)
    })

    it('should call to get full device info from api', () => {
      saga.next(mockDeviceInfo).call(api.getDeviceVersion, {
        provider: mockDeviceInfo.providerId,
        target_id: mockDeviceInfo.targetId
      })
    })

    it('should call to get full firmware info from api', () => {
      saga.next(mockDeviceVersion).call(api.getCurrentFirmware, {
        device_version: mockDeviceVersion.id,
        version_name: mockDeviceInfo.fullVersion,
        provider: mockDeviceInfo.providerId
      })
    })

    it('should select ledger socket url', () => {
      saga.next(mockFirmware).select(selectors.core.walletOptions.getDomains)
    })

    it('should call to confirm device authenticity', () => {
      saga
        .next(Remote.of({ ledgerSocket: mockLedgerSocketUrl }))
        .call(
          Lockbox.firmware.checkDeviceAuthenticity,
          mockTransport,
          mockLedgerSocketUrl,
          { targetId: mockDeviceInfo.targetId, perso: mockFirmware.perso }
        )
    })

    it('should put device auth success action', () => {
      saga.next(true).put(A.checkDeviceAuthenticitySuccess(true))
    })

    it('should end', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'device auth failed' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(A.checkDeviceAuthenticityFailure(false))
        .next()
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'checkDeviceAuthenticity',
            error
          )
        )
        .next()
        .isDone()
    })
  })

  describe('saveNewDeviceKvStore', () => {
    const saga = testSaga(saveNewDeviceKvStore)

    it('sets saveNewDeviceKvStore to loading', () => {
      saga.next().put(A.saveNewDeviceKvStoreLoading())
    })
    it('selects devices list from state', () => {
      saga.next().select(selectors.core.kvStore.lockbox.getDevices)
    })
    it('gets new device info', () => {
      saga.next(Remote.of([])).select(S.getNewDeviceInfo)
    })
    it('creates a new device entry', () => {
      saga
        .next(Remote.of(newDeviceInfoMock))
        .put(
          actions.core.kvStore.lockbox.createNewDeviceEntry(mdAccountsEntryMock)
        )
    })
    it('sets saveNewDeviceKvStore to success', () => {
      saga.next().put(A.saveNewDeviceKvStoreSuccess())
    })
    it('fetches data for all coins', () => {
      saga
        .next()
        .put(actions.core.data.bch.fetchData())
        .next()
        .put(actions.core.data.bitcoin.fetchData())
        .next()
        .put(actions.core.data.ethereum.fetchData())
        .next()
        .put(actions.core.data.xlm.fetchData())
    })
    it('alerts success and finishes', () => {
      saga
        .next()
        .next()
        .isDone()
    })

    describe('failure', () => {
      const error = new Error('Error')

      it('alerts failure and logs error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .next()
          .put(A.saveNewDeviceKvStoreFailure(error))
          .next()
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'saveNewDeviceKvStore',
              error
            )
          )
      })
    })
  })

  describe('determineLockboxRoute', () => {
    const saga = testSaga(determineLockboxRoute)

    describe('no devices', () => {
      it('selects devices', () => {
        saga.next().select(selectors.core.kvStore.lockbox.getDevices)
      })
      it('routes user to onboarding if no devices exist', () => {
        saga.next(Remote.of([])).put(actions.router.push('/lockbox/onboard'))
      })
      it('should end', () => {
        saga.next().isDone()
      })
    })

    describe('one device', () => {
      it('selects devices', () => {
        saga
          .restart()
          .next()
          .select(selectors.core.kvStore.lockbox.getDevices)
      })
      it('inits first device page dashboard', () => {
        saga.next(Remote.of([{}])).put(A.initializeDashboard(0))
      })
      it('routes user to first device page', () => {
        saga.next().put(actions.router.push('/lockbox/dashboard/0'))
      })
      it('should end', () => {
        saga.next().isDone()
      })
    })

    describe('failure', () => {
      const error = new Error('error')

      it('alerts failure and logs error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'determineLockboxRoute',
              error
            )
          )
          .next()
          .isDone()
      })
    })
  })

  describe('saveCoinMD', () => {
    describe('xlm', () => {
      const deviceType = 'ledger'
      const deviceIndex = 1
      const mockTransport = 'tport'
      const coin = 'xlm'
      const mockPubKeyXlm =
        'ZZ4GRUK7IVYKTDJLIQO3VRYCUQG4SZZFM767Z7C77DLY5JXDFMTKYH3I'
      const mockMdEntry = { coin, publicKey: mockPubKeyXlm }
      let payload = { deviceIndex, coin }
      const saga = testSaga(saveCoinMD, { payload })

      it('selects device from index', () => {
        saga
          .next()
          .select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
      })
      it('prompts for Lockbox connection', () => {
        saga
          .next(
            Remote.of({
              device_type: deviceType,
              deviceName: 'test'
            })
          )
          .call(
            SagaService.promptForLockbox,
            coin.toUpperCase(),
            deviceType,
            [],
            false
          )
      })
      it('selects current connection', () => {
        saga.next().select(S.getCurrentConnection)
      })
      it('retrieves xlm public key', () => {
        saga
          .next({ transport: mockTransport })
          .call(Lockbox.utils.getXlmPublicKey, deviceType, mockTransport)
      })
      it('generates xlm account metadata entry', () => {
        saga
          .next({ publicKey: mockPubKeyXlm, entry: mockMdEntry })
          .put(actions.components.lockbox.setConnectionSuccess())
      })
      it('should close modal', () => {
        saga
          .next()
          .next()
          .put(actions.modals.closeAllModals())
      })
      it('should store new coin', () => {
        saga.next().put(
          actions.core.kvStore.lockbox.addCoinEntry(deviceIndex, coin, {
            default_account_idx: 0,
            accounts: [
              {
                publicKey: mockPubKeyXlm,
                label: 'undefined - XLM Wallet',
                archived: false
              }
            ],
            tx_notes: {}
          })
        )
      })
      it('should wait for lockbox metadata fetch success', () => {
        saga
          .next()
          .take(actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS)
      })
      it('should init dashboard', () => {
        saga.next().put(A.initializeDashboard(deviceIndex))
      })
      it('should end', () => {
        saga.next().isDone()
      })
    })

    describe('default no coin error', () => {
      const deviceType = 'ledger'
      const deviceIndex = 1
      const coin = 'neo'
      const error = new Error('unknown coin type')
      let payload = { deviceIndex, coin }
      const saga = testSaga(saveCoinMD, { payload })

      it('selects device from index', () => {
        saga
          .next()
          .select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
      })
      it('throws unknown coin error', () => {
        saga
          .next(
            Remote.of({
              device_type: deviceType,
              deviceName: 'test'
            })
          )
          .put(actions.logs.logErrorMessage(logLocation, 'saveCoinMD', error))
      })
      it('should end', () => {
        saga.next().isDone()
      })
    })

    describe('failure', () => {
      let payload = { deviceIndex: 1, coin: 'xlm' }
      const saga = testSaga(saveCoinMD, { payload })
      const error = new Error('error')

      it('alerts failure and logs error', () => {
        saga
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'saveCoinMD', error))
          .next()
          .isDone()
      })
    })
  })

  describe('updateDeviceName', () => {
    const deviceName = 'Test'
    const deviceIndex = 1
    let payload = { deviceIndex, deviceName }
    const saga = testSaga(updateDeviceName, { payload })

    describe('success', () => {
      it('sets update device name loading', () => {
        saga.next().put(A.updateDeviceNameLoading())
      })
      it('stores new device name', () => {
        saga
          .next()
          .put(
            actions.core.kvStore.lockbox.updateDeviceName(
              deviceIndex,
              deviceName
            )
          )
      })
      it('sets update device name success', () => {
        saga.next().put(A.updateDeviceNameSuccess())
      })
      it('should end', () => {
        saga
          .next()
          .next()
          .isDone()
      })
    })

    describe('failure', () => {
      const error = new Error('error')

      it('alerts failure and logs error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(A.updateDeviceNameFailure())
          .next()
          .next()
          .put(
            actions.logs.logErrorMessage(logLocation, 'updateDeviceName', error)
          )
          .next()
          .isDone()
      })
    })
  })

  describe('deleteDevice', () => {
    const deviceIndex = 1
    let payload = { deviceIndex }
    const saga = testSaga(deleteDevice, { payload })

    describe('success', () => {
      it('calls for device connection', () => {
        saga.next().call(SagaService.confirm, {
          title: CC.CONFIRM_DELETE_LOCKBOX_TITLE,
          message: CC.CONFIRM_DELETE_LOCKBOX_MESSAGE,
          nature: 'warning'
        })
      })
      it('sets delete device loading', () => {
        saga.next(true).put(A.deleteDeviceLoading())
      })
      it('calls to delete device', () => {
        saga
          .next()
          .put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceIndex))
      })
      it('routes to lockbox page', () => {
        saga.next().put(actions.router.push('/lockbox/onboard'))
      })
      it('sets delete device success', () => {
        saga.next().put(A.deleteDeviceSuccess())
      })
      it('fetches latest transactions', () => {
        saga
          .next()
          .next()
          .put(actions.core.data.bitcoin.fetchTransactions('', true))
          .next()
          .put(actions.core.data.ethereum.fetchTransactions('', true))
          .next()
          .put(actions.core.data.bch.fetchTransactions('', true))
          .next()
          .put(actions.core.data.xlm.fetchTransactions('', true))
      })
      it('should end', () => {
        saga.next().isDone()
      })
    })

    describe('failure', () => {
      const error = new Error('error')

      it('alerts failure and logs error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', error))
          .next()
          .isDone()
      })
    })
  })

  describe('deriveLatestAppInfo', () => {
    const error = new Error('error')
    const mockDeviceInfo = {
      targetId: 923,
      providerId: 11,
      fullVersion: '1.3.2'
    }
    const mockFirmwareInfo = { id: 4 }
    const mockSeFirmwareVersion = { id: 7 }
    const saga = testSaga(deriveLatestAppInfo)

    it('sets app info loading', () => {
      saga.next().put(A.setLatestAppInfosLoading())
    })
    it('gets current connection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('gets current device info', () => {
      saga.next({ transport: {} }).call(Lockbox.utils.getDeviceInfo, {})
    })
    it('sets device targetId', () => {
      saga
        .next(mockDeviceInfo)
        .put(A.setDeviceTargetId(mockDeviceInfo.targetId))
    })
    it('calls api to get device version info', () => {
      saga.next().call(api.getDeviceVersion, {
        provider: mockDeviceInfo.providerId,
        target_id: mockDeviceInfo.targetId
      })
    })
    it('calls api to get device firmware info', () => {
      saga.next(mockFirmwareInfo).call(api.getCurrentFirmware, {
        device_version: mockFirmwareInfo.id,
        version_name: mockDeviceInfo.fullVersion,
        provider: mockDeviceInfo.providerId
      })
    })
    it('calls api to get app information', () => {
      saga.next(mockSeFirmwareVersion).call(api.getApplications, {
        provider: mockDeviceInfo.providerId,
        current_se_firmware_final_version: mockSeFirmwareVersion.id,
        device_version: mockFirmwareInfo.id
      })
    })
    it('filters app list and sets data success', () => {
      const mockAppInfo = {
        application_versions: [
          { application_versions: 7, name: 'Bitcoin' },
          { application_versions: 7, name: 'NEO' }
        ]
      }
      saga
        .next(mockAppInfo)
        .put(A.setLatestAppInfosSuccess([mockAppInfo.application_versions[0]]))
    })
    it('should end', () => {
      saga.next().isDone()
    })
    it('logs failure', () => {
      saga
        .restart()
        .next()
        .throw(error)
        .put(A.setLatestAppInfosFailure())
        .next()
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'deriveLatestAppInfo',
            error
          )
        )
        .next()
        .isDone()
    })
  })

  describe('routeNewDeviceToDashboard', () => {
    let payload = { startTour: true }
    const error = new Error('error')
    const saga = testSaga(routeNewDeviceToDashboard, { payload })

    it('selects devices from kvStore', () => {
      saga.next().select(selectors.core.kvStore.lockbox.getDevices)
    })
    it('inits dashboard', () => {
      saga.next(Remote.of([{}])).put(A.initializeDashboard(0))
    })
    it('sets product tour visibility to true', () => {
      saga.next().put(A.setProductTourVisibility(true))
    })
    it('routes to dashboard page', () => {
      saga.next().put(actions.router.push('/lockbox/dashboard/0'))
    })
    it('should end', () => {
      saga.next().isDone()
    })
    it('logs failure', () => {
      saga
        .restart()
        .next()
        .throw(error)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'routeNewDeviceToDashboard',
            error
          )
        )
        .next()
        .isDone()
    })
  })

  describe('updateTransactionList', () => {
    const deviceIndex = 1
    let payload = { deviceIndex, reset: false }
    const saga = testSaga(updateTransactionList, { payload })

    it('selects coin contexts', () => {
      saga
        .next()
        .select(
          selectors.core.kvStore.lockbox.getBtcContextForDevice,
          deviceIndex
        )
        .next(Remote.of({}))
        .select(
          selectors.core.kvStore.lockbox.getBchContextForDevice,
          deviceIndex
        )
        .next(Remote.of({}))
        .select(
          selectors.core.kvStore.lockbox.getEthContextForDevice,
          deviceIndex
        )
        .next(Remote.of({}))
        .select(
          selectors.core.kvStore.lockbox.getXlmContextForDevice,
          deviceIndex
        )
    })
    it('fetches transactions', () => {
      saga
        .next(Remote.of({}))
        .put(actions.core.data.bitcoin.fetchTransactions({}, false))
        .next()
        .put(actions.core.data.ethereum.fetchTransactions({}, false))
        .next()
        .put(actions.core.data.bch.fetchTransactions({}, false))
        .next()
        .put(actions.core.data.xlm.fetchTransactionsSuccess([], true))
    })
    it('should end', () => {
      saga.next().isDone()
    })
  })

  describe('initializeNewDeviceSetup', () => {
    const saga = testSaga(initializeNewDeviceSetup)

    it('calls for device type channel polling', () => {
      saga.next().call(pollForDeviceTypeChannel, 2500)
    })
    it('should end', () => {
      saga
        .next()
        .next()
        .next()
        .isDone()
    })
  })

  describe('finalizeNewDeviceSetup', () => {
    const saga = testSaga(finalizeNewDeviceSetup)

    it('should get device type from connection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('should reset old connection', () => {
      saga.next({ deviceType: 'ledger' }).put(A.resetConnectionStatus())
    })
    it('should poll for btc connection', () => {
      saga.next().call(pollForDeviceAppChannel, 'BTC', 2500)
    })
    it('waits for and takes the btc connection', () => {
      saga
        .next()
        .next()
        .take(AT.SET_CONNECTION_INFO)
    })
    it('should get transport from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })
  })

  describe('initializeAppManager', () => {
    const deviceIndex = 1
    const mockDeviceType = 'ledger'
    const error = new Error('error')
    let payload = { deviceIndex }
    const saga = testSaga(initializeAppManager, { payload })

    it('should get transport from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('should get devices', () => {
      saga
        .next({ app: 'BTC' })
        .select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
    })
    it('should poll for device connection', () => {
      saga
        .next(Remote.of({ device_type: mockDeviceType }))
        .put(A.pollForDeviceApp('DASHBOARD', null, mockDeviceType))
    })
    it('should wait dashboard connection', () => {
      saga.next().take(AT.SET_CONNECTION_INFO)
    })
    it('should call to fetch app info', () => {
      saga.next().call(deriveLatestAppInfo)
    })
    it('should end', () => {
      saga.next().isDone()
    })
    it('logs failure', () => {
      saga
        .restart()
        .next()
        .throw(error)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'initializeAppManager',
            error
          )
        )
        .next()
        .isDone()
    })
  })
})
