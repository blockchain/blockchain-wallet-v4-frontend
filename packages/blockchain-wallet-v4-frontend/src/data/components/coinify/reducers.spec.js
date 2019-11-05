import * as actions from './actions'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import reducer from './reducers'

const INITIAL_STATE = {
  checkoutBusy: false,
  checkoutError: false,
  coinifyBusy: Remote.NotAsked,
  checkoutStep: 'checkout',
  signupComplete: null,
  payment: Remote.NotAsked,
  country: null,
  medium: null
}

const ERROR = 'error'

describe('coinify reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle COINIFY_NEXT_CHECKOUT_STEP', () => {
    const action = actions.coinifyNextCheckoutStep('bankTransferDetails')
    const expectedState = assoc(
      'checkoutStep',
      'bankTransferDetails',
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SET_MEDIUM', () => {
    const action = actions.setMedium('card')
    const expectedState = assoc('medium', 'card', INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_CHECKOUT_BUSY_ON', () => {
    const action = actions.coinifyCheckoutBusyOn()
    const expectedState = assoc('checkoutBusy', true, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_CHECKOUT_BUSY_OFF', () => {
    const action = actions.coinifyCheckoutBusyOff()
    const expectedState = assoc('checkoutBusy', false, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SET_CHECKOUT_ERROR', () => {
    const action = actions.setCoinifyCheckoutError(ERROR)
    const expectedState = assoc('checkoutError', ERROR, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_CLEAR_CHECKOUT_ERROR', () => {
    const action = actions.clearCoinifyCheckoutError()
    const expectedState = assoc('checkoutError', false, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_NOT_ASKED', () => {
    const action = actions.coinifyNotAsked()
    const expectedState = assoc('coinifyBusy', Remote.NotAsked, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_LOADING', () => {
    const action = actions.coinifyLoading()
    const expectedState = assoc('coinifyBusy', Remote.Loading, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SUCCESS', () => {
    const action = actions.coinifySuccess()
    const expectedState = assoc(
      'coinifyBusy',
      Remote.Success(action.payload),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_FAILURE', () => {
    const action = actions.coinifyFailure()
    const expectedState = assoc(
      'coinifyBusy',
      Remote.Failure(action.payload),
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle SET_CANCEL_TRADE_ID', () => {
    const action = actions.setCancelTradeId(5)
    const expectedState = assoc('cancelTradeId', 5, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })
})
