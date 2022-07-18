import * as AT from './actionTypes'
import { RecoveryPhraseActionTypes } from './types'

export const setStep = (
  step:
    | 'RECOVERY_PHRASE_INTRO'
    | 'FIRST_SET_WORDS'
    | 'SECOND_SET_WORDS'
    | 'CONFIRM_WORDS'
    | 'CONFIRM_WORDS_SUCCESS'
    | 'CONFIRM_WORDS_SHORTCUT'
    | 'CONFIRM_WORDS_PIN'
): RecoveryPhraseActionTypes => ({
  payload: {
    step
  },
  type: AT.SET_STEP
})
