import { insert, merge, remove, update } from 'ramda'

import * as AT from './actionTypes'
import { ModalActionTypes, ModalsState } from './types'

const INITIAL_STATE: ModalsState = []

export const modalsReducer = (state = INITIAL_STATE, action: ModalActionTypes): ModalsState => {
  const nextIndex = state.length
  const lastIndex = state.length - 1

  switch (action.type) {
    case AT.CLOSE_MODAL:
      if (action.payload.modalName) {
        return state.filter((modal) => modal.type !== action.payload.modalName)
      }

      return remove(lastIndex, 1, state)
    case AT.CLOSE_ALL_MODALS:
      return []
    case AT.SHOW_MODAL: {
      return state.filter((x) => x.type === action.payload.type).length === 0
        ? insert(nextIndex, action.payload, state)
        : state
    }
    case AT.UPDATE_MODAL: {
      const lastModal = state[state.length - 1]
      const updatedModal = merge(lastModal, action.payload)
      return update(lastIndex, updatedModal, state)
    }
    default:
      return state
  }
}

export default modalsReducer
