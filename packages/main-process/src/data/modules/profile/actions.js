import * as AT from './actionTypes'

export const fetchUserDataSuccess = userData => ({
  type: AT.FETCH_USER_DATA_SUCCESS,
  payload: { userData }
})
export const fetchUserDataLoading = () => ({
  type: AT.FETCH_USER_DATA_LOADING
})
export const fetchUserDataFailure = error => ({
  type: AT.FETCH_USER_DATA_FAILURE,
  payload: { error }
})
export const fetchUser = () => ({
  type: AT.FETCH_USER
})

export const fetchTiersSuccess = userTiers => ({
  type: AT.FETCH_TIERS_SUCCESS,
  payload: { userTiers }
})
export const fetchTiersLoading = () => ({
  type: AT.FETCH_TIERS_LOADING
})
export const fetchTiersFailure = error => ({
  type: AT.FETCH_TIERS_FAILURE,
  payload: { error }
})
export const setApiTokenNotAsked = () => ({
  type: AT.SET_API_TOKEN_NOT_ASKED
})
export const setApiTokenSuccess = token => ({
  type: AT.SET_API_TOKEN_SUCCESS,
  payload: { token }
})
export const setApiTokenLoading = () => ({
  type: AT.SET_API_TOKEN_LOADING
})
export const setApiTokenFailure = e => ({
  type: AT.SET_API_TOKEN_FAILURE,
  payload: { e }
})

export const signIn = () => ({
  type: AT.SIGN_IN
})
export const clearSession = () => ({
  type: AT.CLEAR_SESSION
})

export const setCampaign = campaign => ({
  type: AT.SET_CAMPAIGN,
  payload: { campaign }
})

export const linkFromPitAccount = linkId => ({
  type: AT.LINK_FROM_PIT_ACCOUNT,
  payload: { linkId }
})
export const linkFromPitAccountLoading = () => ({
  type: AT.LINK_FROM_PIT_ACCOUNT_LOADING
})
export const linkFromPitAccountSuccess = data => ({
  type: AT.LINK_FROM_PIT_ACCOUNT_SUCCESS,
  payload: { data }
})
export const linkFromPitAccountFailure = e => ({
  type: AT.LINK_FROM_PIT_ACCOUNT_FAILURE,
  payload: { e }
})

export const linkToPitAccount = () => ({
  type: AT.LINK_TO_PIT_ACCOUNT
})
export const linkToPitAccountLoading = () => ({
  type: AT.LINK_TO_PIT_ACCOUNT_LOADING
})
export const linkToPitAccountSuccess = () => ({
  type: AT.LINK_TO_PIT_ACCOUNT_SUCCESS
})
export const linkToPitAccountFailure = e => ({
  type: AT.LINK_TO_PIT_ACCOUNT_FAILURE,
  payload: { e }
})
export const linkToPitAccountReset = () => ({
  type: AT.LINK_TO_PIT_ACCOUNT_RESET
})
export const setLinkToPitAccountDeepLink = deeplink => ({
  type: AT.SET_LINK_TO_PIT_ACCOUNT_DEEPLINK,
  payload: { deeplink }
})

export const shareWalletAddressesWithPit = () => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_PIT
})
export const shareWalletAddressesWithPitLoading = () => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_PIT_LOADING
})
export const shareWalletAddressesWithPitSuccess = data => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_PIT_SUCCESS,
  payload: { data }
})
export const shareWalletAddressesWithPitFailure = e => ({
  type: AT.SHARE_WALLET_ADDRESSES_WITH_PIT_FAILURE,
  payload: { e }
})
