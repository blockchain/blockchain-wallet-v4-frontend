// import { select } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'
// import { call } from 'redux-saga-test-plan/matchers'

// import rootReducer from '../../rootReducer'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as A from './actions'
// import * as S from './selectors'
import * as AT from './actionTypes'
// import * as actions from '../../actions'
// import * as selectors from '../../selectors'
import lockboxSagas from './sagas'

jest.mock('blockchain-wallet-v4/src/redux/sagas')

const api = {
  obtainSessionToken: jest.fn(),
  deauthorizeBrowser: jest.fn()
}
const coreSagas = coreSagasFactory({ api })

describe('lockbox sagas', () => {
  const { pollForDeviceChannel, initializeNewDeviceSetup } = lockboxSagas({
    api,
    coreSagas
  })

  describe('initializeNewDeviceSetup()', () => {
    const saga = testSaga(initializeNewDeviceSetup)

    it('changes device setup step', () => {
      saga.next().put(A.changeDeviceSetupStep('connect-device'))
    })
    it('opens a channel and polls for device', () => {
      saga.next().call(pollForDeviceChannel)
    })
    it('sets the connection info', () => {
      saga
        .next()
        .next()
        .take(AT.SET_CONNECTION_INFO)
    })
    it('takes setup step 1', () => {
      saga
        .next({ payload: { deviceType: 'ledger' } })
        .take(AT.SET_NEW_DEVICE_SETUP_STEP)
    })
    it('checks device auth', () => {
      saga.next().put(A.checkDeviceAuthenticity())
    })
    it('takes setup step 2', () => {
      saga.next().take(AT.SET_NEW_DEVICE_SETUP_STEP)
    })
    it("polls for device's btc app", () => {
      saga.next().put(A.pollForDeviceApp('BTC', null, 'ledger'))
    })
    it('takes set connection info', () => {
      saga.next().take(AT.SET_CONNECTION_INFO)
    })
  })
})
