import { assoc, assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = {
  connection: {},
  firmware: {},
  installs: {
    apps: {
      BTC: Remote.NotAsked,
      BCH: Remote.NotAsked,
      ETH: Remote.NotAsked
    },
    blockchain: Remote.NotAsked
  },
  newDeviceSetup: {
    device: Remote.NotAsked,
    isAuthentic: Remote.NotAsked
  }
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
    const action = actions.changeDeviceSetupStep('open-btc-app', true)
    const expectedState = assocPath(
      ['newDeviceSetup', 'currentStep'],
      { step: 'open-btc-app', done: true },
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set check device authenticity to loading', () => {
    const action = actions.checkDeviceAuthenticityLoading()
    const expectedState = assocPath(
      ['newDeviceSetup', 'isAuthentic'],
      Remote.Loading,
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set check device authenticity to failure', () => {
    const ERROR = 'authenticity-error'
    const action = actions.checkDeviceAuthenticityFailure(ERROR)
    const expectedState = assocPath(
      ['newDeviceSetup', 'isAuthentic'],
      Remote.Failure({ failure: ERROR }),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set check device authenticity to success', () => {
    const action = actions.checkDeviceAuthenticitySuccess(true)
    const expectedState = assocPath(
      ['newDeviceSetup', 'isAuthentic'],
      Remote.Success({ isAuthentic: true }),
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

  it('should install application', () => {
    const action = actions.installApplication('BTC')
    const expectedState = assocPath(
      ['installs', 'apps', 'BTC'],
      Remote.Loading,
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set install application failure', () => {
    const PAYLOAD = { app: 'BTC', error: 'error' }
    const action = actions.installApplicationFailure('BTC', 'error')
    const expectedState = assocPath(
      ['installs', 'apps', 'BTC'],
      Remote.Failure(PAYLOAD),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should set install application success', () => {
    const PAYLOAD = { app: 'ETH' }
    const action = actions.installApplicationSuccess('ETH')
    const expectedState = assocPath(
      ['installs', 'apps', 'ETH'],
      Remote.Success(PAYLOAD),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })
})
