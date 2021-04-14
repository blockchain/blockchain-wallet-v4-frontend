import { SwapAccountType } from '../swap/types'
import * as AT from './actionTypes'
import { RequestActionTypes } from './types'

export const getNextAddress = (account: SwapAccountType) => ({
  type: AT.GET_NEXT_ADDRESS,
  payload: { account }
})
export const getNextAddressLoading = (key: string): RequestActionTypes => ({
  type: AT.GET_NEXT_ADDRESS_LOADING,
  payload: { key }
})
export const getNextAddressFailure = (
  key: string,
  error: string
): RequestActionTypes => ({
  type: AT.GET_NEXT_ADDRESS_FAILURE,
  payload: { key, error }
})
export const getNextAddressSuccess = (
  key: string,
  address: string
): RequestActionTypes => ({
  type: AT.GET_NEXT_ADDRESS_SUCCESS,
  payload: { key, address }
})
