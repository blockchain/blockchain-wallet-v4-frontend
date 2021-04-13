import { RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

export type RequestState = {
  /*  
    {
        Coin + Label: RemoteDataType<any, "18sikQNP236uPKRtUMrUF8H2vwv9CKbKfP">
        'BTC Private Key Wallet': Remote.Success<"18sikQNP236uPKRtUMrUF8H2vwv9CKbKfP">
    }
  */
  [key in string]: RemoteDataType<any, string>
}

interface GetNextAddressFailureActionType {
  payload: {
    error: string
    key: string
  }
  type: typeof AT.GET_NEXT_ADDRESS_FAILURE
}
interface GetNextAddressLoadingActionType {
  payload: {
    key: string
  }
  type: typeof AT.GET_NEXT_ADDRESS_LOADING
}
interface GetNextAddressSuccessActionType {
  payload: {
    address: string
    key: string
  }
  type: typeof AT.GET_NEXT_ADDRESS_SUCCESS
}

export type RequestActionTypes =
  | GetNextAddressFailureActionType
  | GetNextAddressLoadingActionType
  | GetNextAddressSuccessActionType
