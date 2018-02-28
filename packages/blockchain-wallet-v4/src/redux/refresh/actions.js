import * as AT from './actionTypes'

export const refresh = () => ({ type: AT.REFRESH })

export const refreshLoading = () => ({ type: AT.REFRESH_LOADING })
export const refreshSuccess = (payload) => ({ type: AT.REFRESH_SUCCESS, payload: payload })
export const refreshFailure = (error) => ({ type: AT.REFRESH_FAILURE, payload: error })

