import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {}

const cache = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.GUID_ENTERED: {
      const { guid } = payload
      return assoc('lastGuid', guid, state)
    }
    default:
      return state
  }
}

export default cache
