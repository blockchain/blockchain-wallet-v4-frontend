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
  payload: { error },
  type: AT.FETCH_TIERS_FAILURE
})
export const fetchTiersLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_TIERS_LOADING
})
export const fetchTiersSuccess = (userTiers): ProfileActionTypes => ({
  payload: { userTiers },
  type: AT.FETCH_TIERS_SUCCESS
})
// event, not used by reducer, not yet typed
export const fetchUserCampaigns = () => ({
  type: AT.FETCH_USER_CAMPAIGNS
})
export const fetchUserCampaignsFailure = (error: NabuApiErrorType): ProfileActionTypes => ({
  payload: { error },
  type: AT.FETCH_USER_CAMPAIGNS_FAILURE
})
export const fetchUserCampaignsLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_USER_CAMPAIGNS_LOADING
})
export const fetchUserCampaignsSuccess = (userCampaigns): ProfileActionTypes => ({
  payload: { userCampaigns },
  type: AT.FETCH_USER_CAMPAIGNS_SUCCESS
})

export const fetchUser = (): ProfileActionTypes => ({
  type: AT.FETCH_USER
})
export const fetchUserDataFailure = (error): ProfileActionTypes => ({
  payload: { error },
  type: AT.FETCH_USER_DATA_FAILURE
})
export const fetchUserDataLoading = (): ProfileActionTypes => ({
  type: AT.FETCH_USER_DATA_LOADING
})
export const fetchUserDataSuccess = (userData): ProfileActionTypes => ({
  payload: { userData },
  type: AT.FETCH_USER_DATA_SUCCESS
})

export const linkFromExchangeAccount = (linkId, email?, address?): ProfileActionTypes => ({
  payload: { address, email, linkId },
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT
})
export const linkFromExchangeAccountFailure = (error): ProfileActionTypes => ({
  payload: { error },
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_FAILURE
})
export const linkFromExchangeAccountLoading = (): ProfileActionTypes => ({
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_LOADING
})
export const linkFromExchangeAccountSuccess = (data): ProfileActionTypes => ({
  payload: { data },
  type: AT.LINK_FROM_EXCHANGE_ACCOUNT_SUCCESS
})

export const linkToExchangeAccount = (utmCampaign): ProfileActionTypes => ({
  payload: { utmCampaign },
  type: AT.LINK_TO_EXCHANGE_ACCOUNT
})
export const linkToExchangeAccountFailure = (error): ProfileActionTypes => ({
  payload: { error },
  type: AT.LINK_TO_EXCHANGE_ACCOUNT_FAILURE
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
  payload: { error },
  type: AT.SET_API_TOKEN_FAILURE
})
export const setApiTokenLoading = (): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_LOADING
})
export const setApiTokenNotAsked = (): ProfileActionTypes => ({
  type: AT.SET_API_TOKEN_NOT_ASKED
})
export const setApiTokenSuccess = (token): ProfileActionTypes => ({
  payload: { token },
  type: AT.SET_API_TOKEN_SUCCESS
})

export const setCampaign = (campaign): ProfileActionTypes => ({
  payload: { campaign },
  type: AT.SET_CAMPAIGN
})

export const setLinkToExchangeAccountDeepLink = (deeplink): ProfileActionTypes => ({
  payload: { deeplink },
  type: AT.SET_LINK_TO_EXCHANGE_ACCOUNT_DEEPLINK
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
export const shareWalletAddressesWithExchangeSuccess = (data): ProfileActionTypes => ({
  payload: { data },
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_SUCCESS
})
export const shareWalletAddressesWithExchangeFailure = (error): ProfileActionTypes => ({
  payload: { error },
  type: AT.SHARE_WALLET_ADDRESSES_WITH_EXCHANGE_FAILURE
})
