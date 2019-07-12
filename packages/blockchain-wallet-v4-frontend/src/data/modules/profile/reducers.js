import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'

import { Remote } from 'blockchain-wallet-v4'
import { INITIAL_TIERS } from './model'

const INITIAL_STATE = {
  apiToken: Remote.NotAsked,
  campaign: {},
  pitLinkId: Remote.NotAsked,
  linkFromPitAccountStatus: Remote.NotAsked,
  linkToPitAccountStatus: Remote.NotAsked,
  shareAddresses: Remote.NotAsked,
  userData: Remote.NotAsked,
  userTiers: Remote.of(INITIAL_TIERS)
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
    case AT.LINK_FROM_PIT_ACCOUNT_SUCCESS:
      return assoc(
        'linkFromPitAccountStatus',
        Remote.Success(payload.data),
        state
      )
    case AT.LINK_FROM_PIT_ACCOUNT_LOADING:
      return assoc('linkFromPitAccountStatus', Remote.Loading, state)
    case AT.LINK_FROM_PIT_ACCOUNT_FAILURE:
      return assoc('linkFromPitAccountStatus', Remote.Failure(payload.e), state)
    case AT.LINK_TO_PIT_ACCOUNT_SUCCESS:
      return assoc('linkToPitAccountStatus', Remote.Success(), state)
    case AT.LINK_TO_PIT_ACCOUNT_LOADING:
      return assoc('linkToPitAccountStatus', Remote.Loading, state)
    case AT.LINK_TO_PIT_ACCOUNT_FAILURE:
      return assoc('linkToPitAccountStatus', Remote.Failure(payload.e), state)
    case AT.CREATE_LINK_ACCOUNT_ID_SUCCESS:
      return assoc('pitLinkId', Remote.Success(payload.data), state)
    case AT.CREATE_LINK_ACCOUNT_ID_LOADING:
      return assoc('pitLinkId', Remote.Loading, state)
    case AT.CREATE_LINK_ACCOUNT_ID_FAILURE:
      return assoc('pitLinkId', Remote.Failure(payload.e), state)
    case AT.SHARE_ADDRESSES_SUCCESS:
      return assoc('shareAddresses', Remote.Success(payload.data), state)
    case AT.SHARE_ADDRESSES_LOADING:
      return assoc('shareAddresses', Remote.Loading, state)
    case AT.SHARE_ADDRESSES_FAILURE:
      return assoc('shareAddresses', Remote.Failure(payload.e), state)
    case AT.SET_CAMPAIGN:
      return assoc('campaign', payload.campaign, state)
    default:
      return state
  }
}
