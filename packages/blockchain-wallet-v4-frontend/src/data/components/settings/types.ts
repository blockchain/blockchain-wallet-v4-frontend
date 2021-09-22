import { RemoteDataType } from '@core/types'

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
