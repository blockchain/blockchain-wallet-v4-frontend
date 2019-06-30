import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'

import { Remote } from 'blockchain-wallet-v4'
import { INITIAL_TIERS } from './model'

const INITIAL_STATE = {
  userTiers: Remote.of(INITIAL_TIERS),
  userData: Remote.NotAsked,
  apiToken: Remote.NotAsked,
  campaign: {},
  linkAccountStatus: Remote.NotAsked,
  createLinkAccountId: Remote.NotAsked
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
    case AT.SET_API_TOKEN_NOT_ASKED:
      return assoc('apiToken', Remote.NotAsked, state)
    case AT.SET_API_TOKEN_SUCCESS:
      return assoc('apiToken', Remote.Success(payload.token), state)
    case AT.SET_API_TOKEN_LOADING:
      return assoc('apiToken', Remote.Loading, state)
    case AT.SET_API_TOKEN_FAILURE:
      return assoc('apiToken', Remote.Failure(payload.e), state)
    case AT.LINK_ACCOUNT_SUCCESS:
      return assoc('linkAccountStatus', Remote.Success(payload.data), state)
    case AT.LINK_ACCOUNT_LOADING:
      return assoc('linkAccountStatus', Remote.Loading, state)
    case AT.LINK_ACCOUNT_FAILURE:
      return assoc('linkAccountStatus', Remote.Failure(payload.e), state)
    case AT.CREATE_LINK_ACCOUNT_ID_SUCCESS:
      return assoc('createLinkAccountId', Remote.Success(payload.data), state)
    case AT.CREATE_LINK_ACCOUNT_ID_LOADING:
      return assoc('createLinkAccountId', Remote.Loading, state)
    case AT.CREATE_LINK_ACCOUNT_ID_FAILURE:
      return assoc('createLinkAccountId', Remote.Failure(payload.e), state)
    case AT.SET_CAMPAIGN:
      return assoc('campaign', payload.campaign, state)
    default:
      return state
  }
}
