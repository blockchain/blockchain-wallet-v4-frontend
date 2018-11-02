import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'

import { Remote } from 'blockchain-wallet-v4'

const INITIAL_STATE = {
  userData: Remote.NotAsked,
  apiToken: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_USER_DATA_SUCCESS:
      const oldValues = state.userData.getOrElse({})
      return assoc(
        'userData',
        Remote.Success(merge(oldValues, payload.userData)),
        state
      )
    case AT.FETCH_USER_DATA_LOADING:
      return assoc('userData', Remote.Loading, state)
    case AT.FETCH_USER_DATA_FAILURE:
      return assoc('userData', Remote.Failure(payload.error), state)
    case AT.SET_API_TOKEN:
      return assoc('apiToken', payload.token, state)
    default:
      return state
  }
}
