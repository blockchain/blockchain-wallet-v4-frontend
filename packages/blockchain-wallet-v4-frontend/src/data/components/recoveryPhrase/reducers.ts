import * as AT from './actionTypes'
import { RecoveryPhraseActionTypes, RecoveryPhraseState } from './types'

const INITIAL_STATE: RecoveryPhraseState = {
  step: 'RECOVERY_PHRASE_INTRO'
}

export function recoveryPhraseReducer(
  state = INITIAL_STATE,
  action: RecoveryPhraseActionTypes
): RecoveryPhraseState {
  if (action.type === AT.SET_STEP) {
    return {
      ...state,
      step: action.payload.step
    }
  }
  return state
}
