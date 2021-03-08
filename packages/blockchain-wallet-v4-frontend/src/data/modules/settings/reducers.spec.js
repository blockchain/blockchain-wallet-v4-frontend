import { assoc } from 'ramda'

import * as actions from './actions'
import reducer from './reducers'

const INITIAL_STATE = {}

describe('settings reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle ADD_MNEMONIC', () => {
    const action = actions.addMnemonic({
      mnemonic: ['hello', 'world']
    })
    const expectedState = assoc(
      'recovery_phrase',
      ['hello', 'world'],
      INITIAL_STATE
    )
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle CLEAR_EMAIL_CODE_FAILURE', () => {
    const action = actions.clearEmailCodeFailure()
    const expectedState = assoc('emailVerifiedError', false, INITIAL_STATE)
    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState)
  })

  it('should handle REMOVE_RECOVERY_PHRASE', () => {
    const action = actions.removeRecoveryPhrase()
    const expectedState = INITIAL_STATE
    expect(reducer({ recovery_phrase: ['foo', 'bar'] }, action)).toEqual(
      expectedState
    )
  })
})
