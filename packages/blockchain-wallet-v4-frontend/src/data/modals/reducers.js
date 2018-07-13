import * as AT from './actionTypes'
import { insert, remove, update, last, merge } from 'ramda'

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
      return state.filter(x => x.type === payload.type).length === 0
        ? insert(nextIndex, payload, state)
        : state
    }
    case AT.REPLACE_MODAL: {
      return update(lastIndex, payload, state)
    }
    case AT.UPDATE_MODAL: {
      const lastModal = last(state)
      const updatedModal = merge(lastModal, payload)
      return update(lastIndex, updatedModal, state)
    }
    default:
      return state
  }
}

export default modals
