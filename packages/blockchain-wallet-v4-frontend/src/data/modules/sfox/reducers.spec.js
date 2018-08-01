import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = {
  sfoxBusy: Remote.NotAsked,
  qaSellAddress: null,
  siftScienceEnabled: false,
  payment: Remote.NotAsked,
  jumioToken: Remote.NotAsked,
  jumioStatus: Remote.NotAsked
}

describe('sfox reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle NEXT_STEP', () => {
    const action = actions.nextStep('verify')
    const expectedState = assoc('signupStep', 'verify', INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SET_VERIFY_ERROR', () => {
    const error = 'Cannot verify'
    const action = actions.setVerifyError(error)
    const expectedState = assoc('verifyError', error, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SFOX_NOT_ASKED', () => {
    const action = actions.sfoxNotAsked()
    const expectedState = assoc('sfoxBusy', Remote.NotAsked, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SFOX_LOADING', () => {
    const action = actions.sfoxLoading()
    const expectedState = assoc('sfoxBusy', Remote.Loading, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SFOX_SUCCESS', () => {
    const action = actions.sfoxSuccess()
    const expectedState = assoc(
      'sfoxBusy',
      Remote.Success(action.payload),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SFOX_FAILURE', () => {
    const action = actions.sfoxFailure()
    const expectedState = assoc(
      'sfoxBusy',
      Remote.Failure(action.payload),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle ENABLE_SIFT_SCIENCE', () => {
    const action = actions.enableSiftScience()
    const expectedState = assoc('siftScienceEnabled', true, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle DISABLE_SIFT_SCIENCE', () => {
    const action = actions.disableSiftScience()
    const expectedState = assoc('siftScienceEnabled', false, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })
})
