import * as AT from './actionTypes'
import { assoc, assocPath, compose, merge } from 'ramda'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { INITIAL_TIERS } from './model'
import { ProfileActionTypes, ProfileState } from './types'

const INITIAL_STATE: ProfileState = {
  apiToken: Remote.NotAsked,
  campaign: {},
  exchangeOnboarding: {
    linkFromExchangeAccountStatus: Remote.NotAsked,
    linkToExchangeAccountDeeplink: null,
    linkToExchangeAccountStatus: Remote.NotAsked,
    shareWalletAddressesWithExchange: Remote.NotAsked
  },
  userData: Remote.NotAsked,
  userCampaigns: Remote.NotAsked,
  userTiers: Remote.Success(INITIAL_TIERS)
}

export function profileReducer (
  state = INITIAL_STATE,
  action: ProfileActionTypes
): ProfileState {
  switch (action.type) {
    case AT.FETCH_USER_DATA_SUCCESS:
      // @ts-ignore
      // FIXME: TypeScript getOrElse
      const oldValues = state.userData.getOrElse({})
      return {
        ...state,
        userData: Remote.Success(merge(oldValues, action.payload.userData))
      }
    // @Leora please finish these and alphabetize
    case AT.FETCH_USER_DATA_LOADING:
      return assoc('userData', Remote.Loading, state)
    case AT.FETCH_USER_DATA_FAILURE:
      return assoc('userData', Remote.Failure(action.payload.error), state)
    case AT.FETCH_USER_CAMPAIGNS_SUCCESS:
      return assoc(
        'userCampaigns',
        Remote.Success(action.payload.userCampaigns),
        state
      )
    case AT.FETCH_USER_CAMPAIGNS_LOADING:
      return assoc('userCampaigns', Remote.Loading, state)
    case AT.FETCH_USER_CAMPAIGNS_FAILURE:
      return assoc('userCampaigns', Remote.Failure(action.payload.error), state)
    case AT.FETCH_TIERS_SUCCESS:
      return assoc('userTiers', Remote.Success(action.payload.userTiers), state)
    case AT.FETCH_TIERS_LOADING:
      return assoc('userTiers', Remote.Loading, state)
    case AT.FETCH_TIERS_FAILURE:
      return assoc('userTiers', Remote.Failure(action.payload.error), state)
    case AT.SET_API_TOKEN_NOT_ASKED:
      return assoc('apiToken', Remote.NotAsked, state)
    case AT.SET_API_TOKEN_SUCCESS:
      return assoc('apiToken', Remote.Success(action.payload.token), state)
    case AT.SET_API_TOKEN_LOADING:
      return assoc('apiToken', Remote.Loading, state)
    case AT.SET_API_TOKEN_FAILURE:
      return assoc('apiToken', Remote.Failure(action.payload.error), state)
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'linkFromExchangeAccountStatus'],
        Remote.Success(action.payload.data),
        state
      )
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING:
      return assocPath(
        ['exchangeOnboarding', 'linkFromExchangeAccountStatus'],
        Remote.Loading,
        state
      )
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE:
      return assocPath(
        ['exchangeOnboarding', 'linkFromExchangeAccountStatus'],
        Remote.Failure(action.payload.error),
        state
      )
    case AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountDeeplink'],
        action.payload.deeplink,
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_RESET:
      // return compose(
      //   assocPath(
      //     ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
      //     Remote.NotAsked
      //   ),
      //   assocPath(['exchangeOnboarding', 'linkToExchangeAccountDeeplink'], null)
      // )(state)
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkFromExchangeAccountStatus: Remote.NotAsked,
          linkToExchangeAccountDeeplink: null
        }
      }
    case AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Loading,
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Success('true'),
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Failure(action.payload.error),
        state
      )
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'shareWalletAddressesWithExchange'],
        Remote.Success(action.payload.data),
        state
      )
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_LOADING:
      return assocPath(
        ['exchangeOnboarding', 'shareWalletAddressesWithExchange'],
        Remote.Loading,
        state
      )
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE:
      return assocPath(
        ['exchangeOnboarding', 'shareWalletAddressesWithExchange'],
        Remote.Failure(action.payload.error),
        state
      )
    case AT.SET_CAMPAIGN:
      return assoc('campaign', action.payload.campaign, state)
    default:
      return state
  }
}

export default profileReducer
