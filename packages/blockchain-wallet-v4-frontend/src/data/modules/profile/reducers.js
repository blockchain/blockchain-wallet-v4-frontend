import * as AT from './actionTypes'
import { assoc, assocPath, compose, merge } from 'ramda'
import { Remote } from 'blockchain-wallet-v4'

import { INITIAL_TIERS } from './model'

const INITIAL_STATE = {
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
    case AT.FETCH_USER_CAMPAIGNS_SUCCESS:
      return assoc(
        'userCampaigns',
        Remote.Success(payload.userCampaigns),
        state
      )
    case AT.FETCH_USER_CAMPAIGNS_LOADING:
      return assoc('userCampaigns', Remote.Loading, state)
    case AT.FETCH_USER_CAMPAIGNS_FAILURE:
      return assoc('userCampaigns', Remote.Failure(payload.error), state)
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
    case AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'linkFromExchangeAccountStatus'],
        Remote.Success(payload.data),
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
        Remote.Failure(payload.e),
        state
      )
    case AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountDeeplink'],
        payload.deeplink,
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_RESET:
      return compose(
        assocPath(
          ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
          Remote.NotAsked
        ),
        assocPath(['exchangeOnboarding', 'linkToExchangeAccountDeeplink'], null)
      )(state)
    case AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Loading,
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Success(payload),
        state
      )
    case AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE:
      return assocPath(
        ['exchangeOnboarding', 'linkToExchangeAccountStatus'],
        Remote.Failure(payload.e),
        state
      )
    case AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS:
      return assocPath(
        ['exchangeOnboarding', 'shareWalletAddressesWithExchange'],
        Remote.Success(payload.data),
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
        Remote.Failure(payload.e),
        state
      )
    case AT.SET_CAMPAIGN:
      return assoc('campaign', payload.campaign, state)
    default:
      return state
  }
}
