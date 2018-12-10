import { assoc, compose } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4'
import { EXCHANGE_STEPS } from './model'

const INITIAL_STATE = {
  step: EXCHANGE_STEPS.EXCHANGE_FORM,
  limits: Remote.NotAsked,
  min: null,
  max: null,
  targetFee: Remote.NotAsked,
  sourceFee: { source: 0, target: 0 },
  showError: false,
  txError: null
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_STEP: {
      return assoc('step', payload.step, state)
    }
    case AT.FETCH_LIMITS_LOADING:
      return assoc('limits', Remote.Loading, state)
    case AT.FETCH_LIMITS_SUCCESS:
      return assoc('limits', Remote.Success(payload.limits), state)
    case AT.FETCH_LIMITS_ERROR:
      return assoc('limits', Remote.Failure(payload.error), state)
    case AT.SET_MIN_MAX:
      return compose(
        assoc('min', payload.min),
        assoc('max', payload.max)
      )(state)
    case AT.FETCH_TARGET_FEES_LOADING:
      return assoc('targetFee', Remote.Loading, state)
    case AT.FETCH_TARGET_FEES_SUCCESS:
      return assoc('targetFee', Remote.Success(payload.fee), state)
    case AT.FETCH_TARGET_FEES_ERROR:
      return assoc('targetFee', Remote.Failure(payload.error), state)
    case AT.SET_SOURCE_FEE:
      return assoc('sourceFee', payload.fee, state)
    case AT.SET_SHOW_ERROR:
      return assoc('showError', payload.showError, state)
    case AT.SET_TX_ERROR:
      return assoc('txError', payload.error, state)
    default:
      return state
  }
}
