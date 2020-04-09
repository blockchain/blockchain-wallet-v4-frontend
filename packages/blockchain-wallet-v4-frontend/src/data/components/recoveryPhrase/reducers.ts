import * as AT from './actionTypes'
import { RecoveryPhraseActionTypes, RecoveryPhraseState } from './types'

const INITIAL_STATE: RecoveryPhraseState = {
  step: 'RECOVERY_PHRASE_INTRO'
}

export function recoveryPhraseReducer (
  state = INITIAL_STATE,
  action: RecoveryPhraseActionTypes
): RecoveryPhraseState {
  if (action.type === AT.SET_STEP) {
    switch (action.payload.step) {
      case 'RECOVERY_PHRASE_INTRO':
      case 'FIRST_SET_WORDS':
      case 'SECOND_SET_WORDS':
      case 'CONFIRM_WORDS':
      case 'CONFIRM_WORDS_SUCCESS':
        return {
          ...state,
          step: action.payload.step
        }
      default: {
        return {
          ...state,
          step: action.payload.step
        }
      }
    }
  } else {
    return state
  }
}
