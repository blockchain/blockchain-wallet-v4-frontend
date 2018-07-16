import * as AT from './actionTypes'
import { assoc, assocPath } from 'ramda'

const INITIAL_STATE = {}

const cache = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.ANNOUNCEMENT_DISMISSED: {
      const { id } = payload
      return assocPath(['announcements', id, 'dismissed'], true, state)
    }
    case AT.ANNOUNCEMENT_TOGGLED: {
      const { id, collapsed } = payload
      return assocPath(['announcements', id, 'collapsed'], collapsed, state)
    }
    case AT.GUID_ENTERED: {
      const { guid } = payload
      return assoc('lastGuid', guid, state)
    }
    default:
      return state
  }
}

export default cache
