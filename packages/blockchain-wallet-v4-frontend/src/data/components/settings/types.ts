import { RemoteDataType } from '@core/types'

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

type SettingsItem = {
  currency: string
  enabled?: boolean
  localisedMessage: string
  period: string
  value: string
}

export type LimitsAndDetails = {
  approvedTierLimit: number
  buyAndDepositWithBank: SettingsItem
  buyAndSell: SettingsItem
  buyWithCard: SettingsItem
  currency: string
  receiveCrypto: SettingsItem
  savingsInterest: SettingsItem
  sendCrypto: SettingsItem
  swapCrypto: SettingsItem
  withdrawalWithBank: SettingsItem
}

// State
export type SettingsState = {
  limitsAndDetails: RemoteDataType<string, LimitsAndDetails>
}
