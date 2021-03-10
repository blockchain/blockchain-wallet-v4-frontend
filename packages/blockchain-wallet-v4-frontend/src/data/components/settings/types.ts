import { RemoteDataType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

export type NabuProductType = 'SWAP' | 'SIMPLEBUY' | 'SAVINGS' | 'BROKERAGE'

export type ProductEligibility = {
  eligible: boolean
  ineligibilityReason: string | undefined
  product: NabuProductType
}

// State
export type SettingsState = {
  productsEligibility: RemoteDataType<string, Array<ProductEligibility>>
}

interface FetchProductsEligibilityFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_PRODUCTS_ELIGIBILITY_FAILURE
}

interface FetchProductsEligibilityLoading {
  type: typeof AT.FETCH_PRODUCTS_ELIGIBILITY_LOADING
}

interface FetchProductsEligibilitySuccess {
  payload: {
    productsEligibility: Array<ProductEligibility>
  }
  type: typeof AT.FETCH_PRODUCTS_ELIGIBILITY_SUCCESS
}

export type SettingsActionTypes =
  | FetchProductsEligibilityFailure
  | FetchProductsEligibilityLoading
  | FetchProductsEligibilitySuccess
