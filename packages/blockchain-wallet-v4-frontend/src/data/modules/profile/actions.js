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

export const linkAccount = linkId => ({
  type: AT.LINK_ACCOUNT,
  payload: { linkId }
})
export const linkAccountLoading = () => ({
  type: AT.LINK_ACCOUNT_LOADING
})
export const linkAccountSuccess = data => ({
  type: AT.LINK_ACCOUNT_SUCCESS,
  payload: { data }
})
export const linkAccountFailure = e => ({
  type: AT.LINK_ACCOUNT_FAILURE,
  payload: { e }
})

export const shareAddresses = linkId => ({
  type: AT.SHARE_ADDRESSES,
  payload: { linkId }
})
export const shareAddressesLoading = () => ({
  type: AT.SHARE_ADDRESSES_LOADING
})
export const shareAddressesSuccess = data => ({
  type: AT.SHARE_ADDRESSES_SUCCESS,
  payload: { data }
})
export const shareAddressesFailure = e => ({
  type: AT.SHARE_ADDRESSES_FAILURE,
  payload: { e }
})
