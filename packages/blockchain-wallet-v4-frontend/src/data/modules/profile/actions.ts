import { NabuApiErrorType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { ProfileActionTypes } from './types'

export const clearSession = () => ({
  type: AT.CLEAR_SESSION
})

export const createUser = () => ({
  type: AT.CREATE_USER
})

export const fetchTiersFailure = (error): ProfileActionTypes => ({
  type: AT.FETCH_TIERS_FAILURE,
  payload: { error }
})
export const fetchTiersLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_TIERS_LOADING
})
export const fetchTiersSuccess = (userTiers): ProfileActionTypes => ({
  type: AT.FETCH_TIERS_SUCCESS,
  payload: { userTiers }
})
// event, not used by reducer, not yet typed
export const fetchUserCampaigns = () => ({
  type: AT.FETCH_USER_CAMPAIGNS
})
export const fetchUserCampaignsFailure = (
  error: NabuApiErrorType
): ProfileActionTypes => ({
  type: AT.FETCH_USER_CAMPAIGNS_FAILURE,
  payload: { error }
})
export const fetchUserCampaignsLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_USER_CAMPAIGNS_LOADING
})
export const fetchUserCampaignsSuccess = (
  userCampaigns
): ProfileActionTypes => ({
  type: AT.FETCH_USER_CAMPAIGNS_SUCCESS,
  payload: { userCampaigns }
})

export const fetchUser = (): ProfileActionTypes => ({
  type: AT.FETCH_USER
})
export const fetchUserDataFailure = (error): ProfileActionTypes => ({
  type: AT.FETCH_USER_DATA_FAILURE,
  payload: { error }
})
export const fetchUserDataLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_USER_DATA_LOADING
})
export const fetchUserDataSuccess = (userData): ProfileActionTypes => ({
  type: AT.FETCH_USER_DATA_SUCCESS,
  payload: { userData }
})

export const linkFromExchangeAccount = (
  linkId,
  email?,
  address?
): ProfileActionTypes => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT,
  payload: { linkId, email, address }
})
export const linkFromExchangeAccountFailure = (error): ProfileActionTypes => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE,
  payload: { error }
})
export const linkFromExchangeAccountLoading = (): ProfileActionTypes => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING
})
export const linkFromExchangeAccountSuccess = (data): ProfileActionTypes => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS,
  payload: { data }
})

export const linkToExchangeAccount = (utmCampaign): ProfileActionTypes => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT,
  payload: { utmCampaign }
})
export const linkToExchangeAccountFailure = (error): ProfileActionTypes => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE,
  payload: { error }
})
export const linkToExchangeAccountLoading = (): ProfileActionTypes => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_LOADING
})
export const linkToExchangeAccountSuccess = (): ProfileActionTypes => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_SUCCESS
})
export const linkToExchangeAccountReset = (): ProfileActionTypes => ({
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_RESET
})

export const setApiTokenFailure = (error): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_FAILURE,
  payload: { error }
})
export const setApiTokenLoading = (): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_LOADING
})
export const setApiTokenNotAsked = (): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_NOT_ASKED
})
export const setApiTokenSuccess = (token): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_SUCCESS,
  payload: { token }
})

export const setCampaign = (campaign): ProfileActionTypes => ({
  type: AT.SET_CAMPAIGN,
  payload: { campaign }
})

export const setLinkToExchangeAccountDeepLink = (
  deeplink
): ProfileActionTypes => ({
  type: AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK,
  payload: { deeplink }
})
// event, not used by reducer, not yet typed
export const signIn = () => ({
  type: AT.SIGN_IN
})
export const shareWalletAddressesWithExchange = (): ProfileActionTypes => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE
})
export const shareWalletAddressesWithExchangeLoading = (): ProfileActionTypes => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_LOADING
})
export const shareWalletAddressesWithExchangeSuccess = (
  data
): ProfileActionTypes => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS,
  payload: { data }
})
export const shareWalletAddressesWithExchangeFailure = (
  error
): ProfileActionTypes => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE,
  payload: { error }
})
