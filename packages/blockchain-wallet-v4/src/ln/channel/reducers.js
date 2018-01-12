import * as T from './actionTypes.js'

// The state is a mapping of channel id to channel
const INITIAL_STATE = {}

const channelReducer = (state = INITIAL_STATE, action) => {
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
    default:
      return INITIAL_STATE
  }
}

export default channelReducer
