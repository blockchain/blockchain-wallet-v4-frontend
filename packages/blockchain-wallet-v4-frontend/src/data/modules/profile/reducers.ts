import { merge } from 'ramda'

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
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

export function profileReducer(
  state = INITIAL_STATE,
  action: ProfileActionTypes
): ProfileState {
  switch (action.type) {
    case AT.FETCH_USER_CAMPAIGNS_FAILURE:
      return {
        ...state,
        userCampaigns: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_USER_CAMPAIGNS_LOADING:
      return {
        ...state,
        userCampaigns: Remote.Loading
      }
    case AT.FETCH_USER_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        userCampaigns: Remote.Success(action.payload.userCampaigns)
      }
    case AT.FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        userData: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_USER_DATA_LOADING:
      return {
        ...state,
        userData: Remote.Loading
      }
    case AT.FETCH_USER_DATA_SUCCESS:
      // @ts-ignore
      // FIXME: TypeScript getOrElse
      const oldValues = state.userData.getOrElse({})
      return {
        ...state,
        userData: Remote.Success(merge(oldValues, action.payload.userData))
      }
    case AT.FETCH_TIERS_FAILURE:
      return {
        ...state,
        userTiers: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_TIERS_LOADING:
      return {
        ...state,
        userTiers: Remote.Loading
      }
    case AT.FETCH_TIERS_SUCCESS:
      return {
        ...state,
        userTiers: Remote.Success(action.payload.userTiers)
      }
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkFromExchangeAccountStatus: Remote.Failure(action.payload.error)
        }
      }
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkFromExchangeAccountStatus: Remote.Loading
        }
      }
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkFromExchangeAccountStatus: Remote.Success(action.payload.data)
        }
      }
    case AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkToExchangeAccountStatus: Remote.Failure(action.payload.error)
        }
      }
    case AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkToExchangeAccountStatus: Remote.Loading
        }
      }
    case AT.LINK_TO_EXCHANGE_ACCOUNT_RESET:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkFromExchangeAccountStatus: Remote.NotAsked,
          linkToExchangeAccountDeeplink: null
        }
      }
    case AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkToExchangeAccountStatus: Remote.Success('true')
        }
      }
    case AT.SET_API_TOKEN_FAILURE:
      return {
        ...state,
        apiToken: Remote.Failure(action.payload.error)
      }
    case AT.SET_API_TOKEN_LOADING:
      return {
        ...state,
        apiToken: Remote.Loading
      }
    case AT.SET_API_TOKEN_NOT_ASKED:
      return {
        ...state,
        apiToken: Remote.NotAsked
      }
    case AT.SET_API_TOKEN_SUCCESS:
      return {
        ...state,
        apiToken: Remote.Success(action.payload.token)
      }
    case AT.SET_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload.campaign
      }
    case AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          linkToExchangeAccountDeeplink: action.payload.deeplink
        }
      }
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          shareWalletAddressesWithExchange: Remote.Failure(action.payload.error)
        }
      }
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_LOADING:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          shareWalletAddressesWithExchange: Remote.Loading
        }
      }
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS:
      return {
        ...state,
        exchangeOnboarding: {
          ...state.exchangeOnboarding,
          shareWalletAddressesWithExchange: Remote.Success(action.payload.data)
        }
      }
    default:
      return state
  }
}

export default profileReducer
