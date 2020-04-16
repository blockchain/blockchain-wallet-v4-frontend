import * as AT from './actionTypes'

// Types

export enum RecoveryPhraseStepType {
  'RECOVERY_PHRASE_INTRO',
  'FIRST_SET_WORDS',
  'SECOND_SET_WORDS',
  'CONFIRM_WORDS',
  'CONFIRM_WORDS_SUCCESS'
}

// State

export type RecoveryPhraseState = {
  step: keyof typeof RecoveryPhraseStepType
}

// Actions

interface SetStepAction {
  payload: {
    step:
      | 'RECOVERY_PHRASE_INTRO'
      | 'FIRST_SET_WORDS'
      | 'SECOND_SET_WORDS'
      | 'CONFIRM_WORDS'
      | 'CONFIRM_WORDS_SUCCESS'
  }
  type: typeof AT.SET_STEP
}

export type RecoveryPhraseActionTypes = SetStepAction
