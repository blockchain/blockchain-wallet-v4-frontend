// import { set } from 'ramda-lens'
// import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_WHATSNEW_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_METADATA_WHATSNEW_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_WHATSNEW_FAILURE: {
      return Remote.Failure(payload)
    }
    default:
      return state
  }
}

// import { set } from 'ramda-lens'
// import { KVStoreEntry } from '../../../types'
// import * as T from './actionTypes.js'

// // initial state should be a kvstore object
// const INITIAL_STATE = {}

// export const whatsNewReducer = (state = INITIAL_STATE, action) => {
//   const { type, payload } = action
//   switch (type) {
//     case T.SET_WHATS_NEW: {
//       const { data } = payload
//       return data
//     }
//     case T.UPDATE_WHATS_NEW: {
//       const { lastViewed } = payload
//       return set(KVStoreEntry.value, { lastViewed }, state)
//     }

//     default:
//       return state
//   }
// }

// export default whatsNewReducer
