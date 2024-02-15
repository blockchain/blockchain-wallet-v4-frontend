import { DexPosition } from 'data/components/dex/types'

export enum DexEvents {
  DEX_COUNTRY_INELIGIBLE_VIEWED = 'DEX Country Ineligible Viewed',
  DEX_ONBOARDING_VIEWED = 'DEX Onboarding Viewed',
  DEX_SETTINGS_OPENED = 'DEX Settings Opened',
  DEX_SLIPPAGE_CHANGED = 'DEX Slippage Changed',
  DEX_SWAPPING_VIEWED = 'DEX Swapping Viewed',
  DEX_SWAP_AMOUNT_ENTERED = 'DEX Swap Amount Entered',
  DEX_SWAP_APPROVE_TOKEN_CLICKED = 'DEX Swap Approve Token Clicked',
  DEX_SWAP_APPROVE_TOKEN_CONFIRMED = 'DEX Swap Approve Token Confirmed',
  DEX_SWAP_CONFIRMED_CLICKED = 'DEX Swap Confirm Clicked',
  DEX_SWAP_DETAIL_EXPANDED = 'DEX Swap Detail Expanded',
  DEX_SWAP_FAILED_VIEWED = 'DEX Swap Failed Viewed',
  DEX_SWAP_INPUT_OPENED = 'DEX Swap Input Opened',
  DEX_SWAP_OUTPUT_NOT_FOUND = 'DEX Swap Output Not Found',
  DEX_SWAP_OUTPUT_OPENED = 'DEX Swap Output Opened',
  DEX_SWAP_OUTPUT_SELECTED = 'DEX Swap Output Selected',
  DEX_SWAP_PREVIEW_VIEWED = 'DEX Swap Preview Viewed'
}

type SwapQuoteProperties = {
  blockchain_fee_amount: number
  blockchain_fee_amount_usd: number
  blockchain_fee_currency: string
  expected_output_amount: number
  expected_output_amount_usd: number
  input_amount: number
  input_amount_usd: number
  input_currency: string
  input_network: string
  min_output_amount: number
  network_fee_amount: number
  network_fee_currency: string
  output_currency: string
  output_network: string
  slippage_allowed: number
  venue: string
}

type DexSwapAmountEntered = {
  key: DexEvents.DEX_SWAP_AMOUNT_ENTERED
  properties: {
    currency: string
    position: DexPosition
  }
}

type DexSwapOutputSelected = {
  key: DexEvents.DEX_SWAP_OUTPUT_SELECTED
  properties: {
    output_currency: string
  }
}

type DexSwapPreviewViewed = {
  key: DexEvents.DEX_SWAP_PREVIEW_VIEWED
  properties: SwapQuoteProperties
}

type DexSwapConfirmedClicked = {
  key: DexEvents.DEX_SWAP_CONFIRMED_CLICKED
  properties: SwapQuoteProperties
}

type DexSwapOutputNotFound = {
  key: DexEvents.DEX_SWAP_OUTPUT_NOT_FOUND
  properties: {
    text_searched: string
  }
}

type DexAction = {
  key:
    | DexEvents.DEX_COUNTRY_INELIGIBLE_VIEWED
    | DexEvents.DEX_ONBOARDING_VIEWED
    | DexEvents.DEX_SETTINGS_OPENED
    | DexEvents.DEX_SLIPPAGE_CHANGED
    | DexEvents.DEX_SWAP_APPROVE_TOKEN_CLICKED
    | DexEvents.DEX_SWAP_APPROVE_TOKEN_CONFIRMED
    | DexEvents.DEX_SWAP_DETAIL_EXPANDED
    | DexEvents.DEX_SWAP_FAILED_VIEWED
    | DexEvents.DEX_SWAP_INPUT_OPENED
    | DexEvents.DEX_SWAP_OUTPUT_OPENED
    | DexEvents.DEX_SWAPPING_VIEWED
  properties: {}
}

export type DexActions =
  | DexAction
  | DexSwapAmountEntered
  | DexSwapConfirmedClicked
  | DexSwapOutputNotFound
  | DexSwapOutputSelected
  | DexSwapPreviewViewed
