export enum Events {
  DEX_COUNTRY_INELIGIBLE_VIEWED = 'DEX Country Ineligible Viewed - user is shown ineligibility screen',
  DEX_ONBOARDING_VIEWED = 'DEX Onboarding Viewed - user is shown first step of the onboarding',
  DEX_SETTINGS_OPENED = 'DEX Settings opened - user opens the settings flyout',
  DEX_SLIPPAGE_CHANGED = 'DEX Slippage changed - user changes slippage',
  DEX_SWAPPING_VIEWED = 'DEX Swapping Viewed - user sees the swapping screen',
  DEX_SWAP_AMOUNT_ENTERED = 'DEX Swap Amount Entered - users enters an amount in the input field',
  DEX_SWAP_APPROVE_TOKEN_CLICKED = 'DEX Swap Approve token clicked - user clicks in approve token to be able to swap',
  DEX_SWAP_APPROVE_TOKEN_CONFIRMED = 'DEX Swap Approve token confirmed - user confirms the approval of the token',
  DEX_SWAP_CONFIRMED_CLICKED = 'DEX Swap Confirm Clicked - user clicks in confirm swap',
  DEX_SWAP_DETAIL_EXPANDED = 'DEX Swap Detail Expanded - user expands to see the full detail of the swap',
  DEX_SWAP_FAILED_VIEWED = 'DEX Swap Failed Viewed - users sees the failed screen',
  DEX_SWAP_INPUT_OPENED = 'DEX Swap Input Opened - user opens the input coin selector',
  DEX_SWAP_OUTPUT_NOT_FOUND = 'DEX Swap Output Not Found - user is shown the “No results for X”',
  DEX_SWAP_OUTPUT_OPENED = 'DEX Swap Output Opened - user opens the output coin selector',
  DEX_SWAP_OUTPUT_SELECTED = 'DEX Swap Output Selected - user selects a token output',
  DEX_SWAP_PREVIEW_VIEWED = 'DEX Swap Preview Viewed - user sees preview screen'
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
  properties: {}
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
