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

export const createLinkAccountId = () => ({
  type: AT.CREATE_LINK_ACCOUNT_ID
})
export const createLinkAccountIdLoading = () => ({
  type: AT.CREATE_LINK_ACCOUNT_ID_LOADING
})
export const createLinkAccountIdSuccess = data => ({
  type: AT.CREATE_LINK_ACCOUNT_ID_SUCCESS,
  payload: { data }
})
export const createLinkAccountIdFailure = e => ({
  type: AT.CREATE_LINK_ACCOUNT_ID_FAILURE,
  payload: { e }
})
