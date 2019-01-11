import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

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

const coinify = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.COINIFY_NEXT_CHECKOUT_STEP: {
      return assoc('checkoutStep', payload, state)
    }
    case AT.COINIFY_SAVE_QUOTE: {
      return assoc('quote', payload, state)
    }
    case AT.COINIFY_SET_MEDIUM: {
      return assoc('medium', payload, state)
    }
    case AT.COINIFY_CHECKOUT_BUSY_ON: {
      return assoc('checkoutBusy', true, state)
    }
    case AT.COINIFY_CHECKOUT_BUSY_OFF: {
      return assoc('checkoutBusy', false, state)
    }
    case AT.COINIFY_SET_CHECKOUT_ERROR: {
      return assoc('checkoutError', payload, state)
    }
    case AT.COINIFY_CLEAR_CHECKOUT_ERROR: {
      return assoc('checkoutError', false, state)
    }
    case AT.COINIFY_NOT_ASKED: {
      return assoc('coinifyBusy', Remote.NotAsked, state)
    }
    case AT.COINIFY_LOADING: {
      return assoc('coinifyBusy', Remote.Loading, state)
    }
    case AT.COINIFY_SUCCESS: {
      return assoc('coinifyBusy', Remote.Success(payload), state)
    }
    case AT.COINIFY_FAILURE: {
      return assoc('coinifyBusy', Remote.Failure(payload), state)
    }
    case AT.SET_CANCEL_TRADE_ID: {
      return assoc('cancelTradeId', payload, state)
    }
    case AT.COINIFY_SIGNUP_COMPLETE: {
      return assoc('signupComplete', true, state)
    }
    case AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(payload), state)
    }
    case AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.COINIFY_SELL_BTC_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(payload), state)
    }
    case AT.COINIFY_SET_COUNTRY: {
      return assoc('country', payload, state)
    }
    default:
      return state
  }
}

export default coinify
