import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'

import { Remote } from 'blockchain-wallet-v4'
import { INITIAL_TIERS } from './model'

const INITIAL_STATE = {
  userTiers: Remote.of(INITIAL_TIERS),
  userData: Remote.NotAsked,
  apiToken: Remote.NotAsked,
  campaign: {}
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
    case AT.FETCH_TIERS_SUCCESS:
      return assoc('userTiers', Remote.Success(payload.userTiers), state)
    case AT.FETCH_TIERS_LOADING:
      return assoc('userTiers', Remote.Loading, state)
    case AT.FETCH_TIERS_FAILURE:
      return assoc('userTiers', Remote.Failure(payload.error), state)
    case AT.SET_API_TOKEN:
      return assoc('apiToken', payload.token, state)
    case AT.SET_CAMPAIGN:
      return assoc('campaign', payload.campaign, state)
    default:
      return state
  }
}
