import {peerReducer} from './peer/reducers'
import {Channel} from '../state'
import * as T from './actionTypes.js'

// The state is a mapping of channel id to channel
const INITIAL_STATE = {}

export const channelReducer = (state = INITIAL_STATE, action) => {
  const { type } = action

  let copy = Object.assign({}, state)
  switch (type) {
    case T.REFRESH:
      let channel = action.payload
      copy[channel.channelId] = channel
      return copy
    case T.REMOVE:
      copy[action.channelId] = undefined
      return copy
  }
}

export default channelReducer
