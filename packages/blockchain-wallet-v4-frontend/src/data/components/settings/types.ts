import { RemoteDataType } from 'blockchain-wallet-v4/src/types'

import {
  fetchProductsEligibilityFailure,
  fetchProductsEligibilityLoading,
  fetchProductsEligibilitySuccess
} from './slice'

export type NabuProductType = 'SWAP' | 'SIMPLEBUY' | 'SAVINGS' | 'BROKERAGE'
export enum NabuProducts {
  BROKERAGE = 'BROKERAGE',
  SAVINGS = 'SAVINGS',
  SIMPLEBUY = 'SIMPLEBUY',
  SWAP = 'SWAP'
}

export type ProductEligibility = {
  eligible: boolean
  ineligibilityReason: string | undefined
  product: NabuProductType
}
export type ProductEligibilityResponse = {
  eligible: boolean
}

// State
export type SettingsState = {
  productsEligibility: RemoteDataType<string, Array<ProductEligibility>>
}

interface FetchProductsEligibilityFailure {
  payload: {
    error: string
  }
  type: typeof fetchProductsEligibilityFailure.type
}

interface FetchProductsEligibilityLoading {
  type: typeof fetchProductsEligibilityLoading.type
}

interface FetchProductsEligibilitySuccess {
  payload: {
    productsEligibility: Array<ProductEligibility>
  }
  type: typeof fetchProductsEligibilitySuccess.type
}

export type SettingsActionTypes =
  | FetchProductsEligibilityFailure
  | FetchProductsEligibilityLoading
  | FetchProductsEligibilitySuccess
