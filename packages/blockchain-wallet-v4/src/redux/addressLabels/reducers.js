import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {}

const addressLabelsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.ADD_ADDRESS_LABEL: {
      const { address, label } = payload
      return assoc(address, label, state)
    }
    default:
      return state
  }
}

export default addressLabelsReducer
