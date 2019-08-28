import { assoc, assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = {
  connection: {},
  firmware: {},
  appManager: {
    latestAppInfos: Remote.NotAsked,
    appChangeStatus: Remote.NotAsked,
    targetId: Remote.NotAsked
  },
  newDeviceSetup: {
    device: Remote.NotAsked,
    deviceType: null,
    newOrExisting: null,
    showBtcWarning: false
  },
  isAuthentic: Remote.NotAsked,
  showProductTour: false
}

describe('lockbox reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should reset connection status', () => {
    const action = actions.resetConnectionStatus()
    const expectedState = assoc('connection', {}, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set new device setup step', () => {
    const action = actions.changeDeviceSetupStep('pair-device', true)
    const expectedState = assocPath(
      ['newDeviceSetup', 'currentStep'],
      { step: 'pair-device', done: true },
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set firmware update step', () => {
    const action = actions.changeFirmwareUpdateStep('connect-device')
    const expectedState = assocPath(
      ['firmware'],
      'connect-device',
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set the device targetId', () => {
    const action = actions.setDeviceTargetId(123)
    const expectedState = assocPath(
      ['appManager', 'targetId'],
      Remote.Success(123),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set app change status to loading', () => {
    const action = actions.appChangeLoading()
    const expectedState = assocPath(
      ['appManager', 'appChangeStatus'],
      Remote.Loading,
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set app change status to success', () => {
    const PAYLOAD = { appName: 'BTC', changeType: 'install' }
    const action = actions.appChangeSuccess('BTC', 'install')
    const expectedState = assocPath(
      ['appManager', 'appChangeStatus'],
      Remote.Success(PAYLOAD),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set app change status to failure', () => {
    const PAYLOAD = { appName: 'ETH', changeType: 'install', error: 'error' }
    const action = actions.appChangeFailure('ETH', 'install', 'error')
    const expectedState = assocPath(
      ['appManager', 'appChangeStatus'],
      Remote.Failure(PAYLOAD),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should reset app change status to not asked', () => {
    const action = actions.resetAppChangeStatus()
    const expectedState = assocPath(
      ['appManager', 'appChangeStatus'],
      Remote.NotAsked,
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })
})
