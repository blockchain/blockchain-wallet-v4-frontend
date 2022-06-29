import { FiatType, RemoteDataType } from '@core/types'

export type NabuProductType = 'swap' | 'simplebuy' | 'savings' | 'brokerage'
export enum NabuProducts {
  BROKERAGE = 'brokerage',
  SAVINGS = 'savings',
  SIMPLEBUY = 'simplebuy',
  SWAP = 'swap'
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
