import { FiatType, WalletCurrencyType } from 'core/types'

export type ProductTypes = 'SWAP' | 'SIMPLEBUY' | 'SAVINGS'

export type IneligibilityReasons =
  | 'INVALID_USER'
  | 'TIER_TOO_LOW'
  | 'INVALID_ADDRESS'
  | 'UNSUPPORTED_CURRENCY'
  | 'UNSUPPORTED_REGION'
  | 'LIMIT_DOES_NOT_EXIST'
  | 'DOCUMENT_NOT_FOUND'
  | 'DOCUMENT_NOT_FROM_UK'
  | 'DOCUMENT_NOT_FROM_TR'
  | 'OTHER'
  | null

export type ProductEligiableResponse =
  | {
      eligible: boolean
      ineligibilityReason: IneligibilityReasons
    }
  | {
      [key in WalletCurrencyType]: EligiableType
    }

export type EligiableType = {
  eligible: boolean
  ineligibilityReason: IneligibilityReasons
}

export type PaymentMethod = {
  currency: FiatType
  eligible: boolean
  ineligibleReason: IneligibilityReasons
  limits: { max: string; min: string }
  subTypes: string[]
  type: 'PAYMENT_CARD' | 'BANK_ACCOUNT'
}
