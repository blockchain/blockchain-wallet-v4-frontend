import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = {
  checkoutBusy: false,
  checkoutError: false,
  coinifyBusy: Remote.NotAsked,
  step: null,
  checkoutStep: 'checkout',
  signupComplete: null,
  payment: Remote.NotAsked
}

const ERROR = 'error'

describe('coinify reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle COINIFY_NEXT_STEP', () => {
    const action = actions.coinifyNextStep('isx')
    const expectedState = assoc('signupStep', 'isx', INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
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

  it('should handle COINIFY_SIGNUP_FAILURE', () => {
    const action = actions.coinifySignupFailure(ERROR)
    const expectedState = assoc('signupError', ERROR, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_CLEAR_SIGNUP_FAILURE', () => {
    const action = actions.coinifyClearSignupError()
    const expectedState = assoc('signupError', null, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SAVE_QUOTE', () => {
    const action = actions.saveQuote({ id: 1 })
    const expectedState = assoc('quote', { id: 1 }, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SAVE_MEDIUM_SUCCESS', () => {
    const action = actions.saveMediumSuccess('card')
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

  it('should handle COINIFY_SIGNUP_COMPLETE', () => {
    const action = actions.coinifySignupComplete()
    const expectedState = assoc('signupComplete', true, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })
})
