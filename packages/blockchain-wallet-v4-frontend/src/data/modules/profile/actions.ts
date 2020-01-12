import * as AT from './actionTypes'
import { ProfileActionTypes } from './types'

export const clearSession = () => ({
  type: AT.CLEAR_SESSION
})

// @Leora please add (parameters): ProfileActionTypes
// to all action creators in reducers
export const fetchTiersFailure = (error): ProfileActionTypes => ({
  type: AT.FETCH_TIERS_FAILURE,
  payload: { error }
})
export const fetchTiersLoading = () => ({
  type: AT.FETCH_TIERS_LOADING
})
export const fetchTiersSuccess = userTiers => ({
  type: AT.FETCH_TIERS_SUCCESS,
  payload: { userTiers }
})

export const fetchUserCampaigns = () => ({
  type: AT.FETCH_USER_CAMPAIGNS
})
export const fetchUserCampaignsFailure = error => ({
  type: AT.FETCH_USER_CAMPAIGNS_FAILURE,
  payload: { error }
})
export const fetchUserCampaignsLoading = () => ({
  type: AT.FETCH_USER_CAMPAIGNS_LOADING
})
export const fetchUserCampaignsSuccess = userCampaigns => ({
  type: AT.FETCH_USER_CAMPAIGNS_SUCCESS,
  payload: { userCampaigns }
})

export const fetchUser = () => ({
  type: AT.FETCH_USER
})
export const fetchUserDataFailure = error => ({
  type: AT.FETCH_USER_DATA_FAILURE,
  payload: { error }
})
export const fetchUserDataLoading = () => ({
  type: AT.FETCH_USER_DATA_LOADING
})
export const fetchUserDataSuccess = userData => ({
  type: AT.FETCH_USER_DATA_SUCCESS,
  payload: { userData }
})

export const linkFromExchangeAccount = linkId => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT,
  payload: { linkId }
})
export const linkFromExchangeAccountFailure = error => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE,
  payload: { error }
})
export const linkFromExchangeAccountLoading = () => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING
})
export const linkFromExchangeAccountSuccess = data => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS,
  payload: { data }
})

export const linkToExchangeAccount = utmCampaign => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT,
  payload: { utmCampaign }
})
export const linkToExchangeAccountFailure = error => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE,
  payload: { error }
})
export const linkToExchangeAccountLoading = () => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING
})
export const linkToExchangeAccountSuccess = () => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS
})
export const linkToExchangeAccountReset = () => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_RESET
})

export const setApiTokenFailure = error => ({
  type: AT.SET_API_TOKEN_FAILURE,
  payload: { error }
})
export const setApiTokenLoading = () => ({
  type: AT.SET_API_TOKEN_LOADING
})
export const setApiTokenNotAsked = () => ({
  type: AT.SET_API_TOKEN_NOT_ASKED
})
export const setApiTokenSuccess = token => ({
  type: AT.SET_API_TOKEN_SUCCESS,
  payload: { token }
})

export const setCampaign = campaign => ({
  type: AT.SET_CAMPAIGN,
  payload: { campaign }
})

export const setLinkToExchangeAccountDeepLink = deeplink => ({
  type: AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK,
  payload: { deeplink }
})

export const signIn = () => ({
  type: AT.SIGN_IN
})

export const shareWalletAddressesWithExchange = () => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE
})
export const shareWalletAddressesWithExchangeLoading = () => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_LOADING
})
export const shareWalletAddressesWithExchangeSuccess = data => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS,
  payload: { data }
})
export const shareWalletAddressesWithExchangeFailure = error => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE,
  payload: { error }
})
