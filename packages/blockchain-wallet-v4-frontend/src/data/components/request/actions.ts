import { SwapAccountType } from '../swap/types'
import * as AT from './actionTypes'
import { RequestActionTypes, RequestExtrasType } from './types'

export const getNextAddress = (account: SwapAccountType) => ({
  payload: { account },
  type: AT.GET_NEXT_ADDRESS
})
export const getNextAddressLoading = (key: string): RequestActionTypes => ({
  payload: { key },
  type: AT.GET_NEXT_ADDRESS_LOADING
})
export const getNextAddressFailure = (key: string, error: string): RequestActionTypes => ({
  payload: { error, key },
  type: AT.GET_NEXT_ADDRESS_FAILURE
})
export const getNextAddressSuccess = (
  key: string,
  address: string,
  extras: RequestExtrasType
): RequestActionTypes => ({
  payload: { address, extras, key },
  type: AT.GET_NEXT_ADDRESS_SUCCESS
})
export const setAddressCopied = () => ({
  type: AT.SET_ADDRESS_COPIED
})
