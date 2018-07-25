import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  sfoxBusy: Remote.NotAsked,
  qaSellAddress: null,
  siftScienceEnabled: false,
  payment: Remote.NotAsked,
  jumioToken: Remote.NotAsked,
  jumioStatus: Remote.NotAsked
}

const sfoxSignup = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.NEXT_STEP: {
      return assoc('signupStep', payload, state)
    }
    case AT.SET_VERIFY_ERROR: {
      return assoc('verifyError', payload, state)
    }
    case AT.SFOX_NOT_ASKED: {
      return assoc('sfoxBusy', Remote.NotAsked, state)
    }
    case AT.SFOX_LOADING: {
      return assoc('sfoxBusy', Remote.Loading, state)
    }
    case AT.SFOX_SUCCESS: {
      return assoc('sfoxBusy', Remote.Success(payload), state)
    }
    case AT.SFOX_FAILURE: {
      return assoc('sfoxBusy', Remote.Failure(payload), state)
    }
    case AT.ENABLE_SIFT_SCIENCE: {
      return assoc('siftScienceEnabled', true, state)
    }
    case AT.DISABLE_SIFT_SCIENCE: {
      return assoc('siftScienceEnabled', false, state)
    }
    case AT.SFOX_SELL_BTC_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(payload), state)
    }
    case AT.SFOX_SELL_BTC_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SFOX_SELL_BTC_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(payload), state)
    }
    case AT.FETCH_JUMIO_STATUS_SUCCESS: {
      return assoc('jumioStatus', Remote.Success(payload), state)
    }
    case AT.FETCH_JUMIO_STATUS_LOADING: {
      return assoc('jumioStatus', Remote.Loading, state)
    }
    case AT.FETCH_JUMIO_STATUS_FAILURE: {
      return assoc('jumioStatus', Remote.Failure(payload), state)
    }
    case AT.FETCH_JUMIO_TOKEN_SUCCESS: {
      return assoc('jumioToken', Remote.Success(payload), state)
    }
    case AT.FETCH_JUMIO_TOKEN_LOADING: {
      return assoc('jumioToken', Remote.Loading, state)
    }
    case AT.FETCH_JUMIO_TOKEN_FAILURE: {
      return assoc('jumioToken', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default sfoxSignup
