import { DexPosition } from 'data/components/dex/types'

export enum Events {
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

type DexCountryIneligibleViewed = {
  key: Events.DEX_COUNTRY_INELIGIBLE_VIEWED
  properties: {}
}

type DexOnboardingViewed = {
  key: Events.DEX_ONBOARDING_VIEWED
  properties: {}
}

type DexSettingsOpened = {
  key: Events.DEX_SETTINGS_OPENED
  properties: {}
}

type DexSlippageChanged = {
  key: Events.DEX_SLIPPAGE_CHANGED
  properties: {}
}

type DexSwapAmountEntered = {
  key: Events.DEX_SWAP_AMOUNT_ENTERED
  properties: {
    currency: string
    position: DexPosition
  }
}

type DexSwapApproveTokenClicked = {
  key: Events.DEX_SWAP_APPROVE_TOKEN_CLICKED
  properties: {}
}

type DexSwapApproveTokenConfirmed = {
  key: Events.DEX_SWAP_APPROVE_TOKEN_CONFIRMED
  properties: {}
}

type DexSwapConfirmedClicked = {
  key: Events.DEX_SWAP_CONFIRMED_CLICKED
  properties: SwapQuoteProperties
}

type DexSwapDetailExpanded = {
  key: Events.DEX_SWAP_DETAIL_EXPANDED
  properties: {}
}

type DexSwapFailedViewed = {
  key: Events.DEX_SWAP_FAILED_VIEWED
  properties: {}
}

type DexSwapInputOpened = {
  key: Events.DEX_SWAP_INPUT_OPENED
  properties: {}
}

type DexSwapOutputNotFound = {
  key: Events.DEX_SWAP_OUTPUT_NOT_FOUND
  properties: {
    text_searched: string
  }
}

type DexSwapOutputOpened = {
  key: Events.DEX_SWAP_OUTPUT_OPENED
  properties: {}
}

type DexSwapOutputSelected = {
  key: Events.DEX_SWAP_OUTPUT_SELECTED
  properties: {
    output_currency: string
  }
}

type DexSwapPreviewViewed = {
  key: Events.DEX_SWAP_PREVIEW_VIEWED
  properties: SwapQuoteProperties
}

type DexSwappingViewed = {
  key: Events.DEX_SWAPPING_VIEWED
  properties: {}
}

export type TrackEventAction =
  | DexCountryIneligibleViewed
  | DexOnboardingViewed
  | DexSettingsOpened
  | DexSlippageChanged
  | DexSwapAmountEntered
  | DexSwapApproveTokenClicked
  | DexSwapApproveTokenConfirmed
  | DexSwapConfirmedClicked
  | DexSwapDetailExpanded
  | DexSwapFailedViewed
  | DexSwapInputOpened
  | DexSwapOutputNotFound
  | DexSwapOutputOpened
  | DexSwapOutputSelected
  | DexSwapPreviewViewed
  | DexSwappingViewed
