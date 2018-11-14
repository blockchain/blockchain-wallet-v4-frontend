import { testSaga } from 'redux-saga-test-plan'

import { Remote, coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import * as S from './selectors'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import * as Lockbox from 'services/LockboxService'
import lockboxSagas from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
Lockbox.apps.installApp = jest.fn()
Lockbox.apps.uninstallApp = jest.fn()

const logLocation = 'components/lockbox/sagas'
const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
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
  device_name: 'My Lockbox Device',
  btc: {
    accounts: [
      {
        label: 'My Lockbox Device - BTC Wallet',
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
        label: 'My Lockbox Device - BCH Wallet',
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
        label: 'My Lockbox Device - ETH Wallet',
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
    pollForDeviceTypeChannel,
    checkDeviceAuthenticity,
    initializeNewDeviceSetup,
    saveNewDeviceKvStore,
    uninstallApplication,
    installApplication,
    deriveLatestAppInfo
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
    const saga = testSaga(checkDeviceAuthenticity)

    it('should set checkDeviceAuthenticity to loading', () => {
      saga.next().put(A.checkDeviceAuthenticityLoading())
    })
    it('should get deviceType from getCurrentConnection', () => {
      saga.next().select(S.getCurrentConnection)
    })
    it('should poll for deviceApp with deviceType', () => {
      saga
        .next({ deviceType: 'ledger' })
        .put(A.pollForDeviceApp('DASHBOARD', null, 'ledger'))
    })
  })

  describe('saveNewDeviceKvStore', () => {
    let payload = { deviceName: 'My Lockbox Device' }
    const saga = testSaga(saveNewDeviceKvStore, { payload })

    it('sets saveNewDeviceKvStore to loading', () => {
      saga.next().put(A.saveNewDeviceKvStoreLoading())
    })
    it('selects deviceInfo from state', () => {
      saga.next().select(S.getNewDeviceInfo)
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
    it('closes the modal', () => {
      saga.next().put(actions.modals.closeModal())
    })
    it('fetches multiaddr data for all coins', () => {
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
    it('alerts success', () => {
      saga.next()
    })
    it('selects devices from kvStore', () => {
      saga.next().select(selectors.core.kvStore.lockbox.getDevices)
    })
    it('inits dashboard at index', () => {
      saga.next(Remote.of([mdAccountsEntryMock])).put(A.initializeDashboard(0))
    })
    it('redirects to lockbox dashboard', () => {
      saga.next().put(actions.router.push('/lockbox/dashboard/0'))
    })

    describe('failure', () => {
      const error = new TypeError(
        "Cannot read property 'deviceName' of undefined"
      )
      const saga = testSaga(saveNewDeviceKvStore, {})
      it('throws if deviceName is not passed', () => {
        saga.next().put(A.saveNewDeviceKvStoreFailure(error))
      })
      it('alerts failure and logs error', () => {
        saga
          .next()
          .next()
          .put(
            actions.logs.logErrorMessage(logLocation, 'storeDeviceName', error)
          )
      })
    })
  })

  describe('initializeNewDeviceSetup()', () => {
    const saga = testSaga(initializeNewDeviceSetup)

    it('changes device setup step', () => {
      saga.next().put(A.changeDeviceSetupStep('connect-device'))
    })
    it('opens a channel and polls for device', () => {
      saga.next().call(pollForDeviceTypeChannel, 2500)
    })
    it('sets the connection info', () => {
      saga
        .next()
        .next()
        .take(AT.SET_CONNECTION_INFO)
    })
    it('waits for setup step 1', () => {
      saga
        .next({ payload: { deviceType: 'ledger' } })
        .take(AT.SET_NEW_DEVICE_SETUP_STEP)
    })
    it('prefetches app info', () => {
      saga.next().call(deriveLatestAppInfo)
    })
    it('checks device auth', () => {
      saga.next().put(A.checkDeviceAuthenticity())
    })
    it('waits for setup step 2', () => {
      saga.next().take(AT.SET_NEW_DEVICE_SETUP_STEP)
    })
    // TODO: unit test rest of saga
  })
})
