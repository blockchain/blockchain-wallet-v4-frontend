import * as AT from './actionTypes'
import { insert, remove, update } from 'ramda'

const INITIAL_STATE = []

const modals = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  const nextIndex = state.length
  const lastIndex = state.length - 1

  switch (type) {
    case AT.CLOSE_MODAL:
      return remove(lastIndex, 1, state)
    case AT.CLOSE_ALL_MODALS:
      return []
    case AT.SHOW_MODAL: {
      return insert(nextIndex, payload, state)
    }
    case AT.REPLACE_MODAL: {
      return update(0, payload, state)
    }
    default:
      return state
  }
}

export default modals
