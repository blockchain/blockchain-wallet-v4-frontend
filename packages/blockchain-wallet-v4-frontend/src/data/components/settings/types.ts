import { FiatType, RemoteDataType } from '@core/types'

export type NabuProductType = 'SWAP' | 'SIMPLEBUY' | 'SAVINGS' | 'BROKERAGE'
export enum NabuProducts {
  BROKERAGE = 'BROKERAGE',
  SAVINGS = 'SAVINGS',
  SIMPLEBUY = 'SIMPLEBUY',
  SWAP = 'SWAP'
}

export type ProductEligibilityResponse = {
  eligible: boolean
}

export type SettingsLimit = {
  period: string
  value: {
    currency: FiatType
    value: string
  }
}

export type SettingsItem = {
  enabled: boolean
  limit: SettingsLimit
  name: string
}

export type LimitsAndDetails = {
  limits: SettingsItem[]
}

// State
export type SettingsState = {
  limitsAndDetails: RemoteDataType<string, LimitsAndDetails>
}
