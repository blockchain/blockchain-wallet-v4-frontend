export enum ExchangePromoEvents {
  EXCHANGE_AWARENESS_PROMPT_CLICKED = 'Exchange Awareness Prompt Clicked',
  EXCHANGE_AWARENESS_PROMPT_DISMISSED = 'Exchange Awareness Prompt Dismissed',
  EXCHANGE_AWARENESS_PROMPT_SHOWN = 'Exchange Awareness Prompt Shown'
}

type ClickedOrDismissed = {
  key:
    | ExchangePromoEvents.EXCHANGE_AWARENESS_PROMPT_DISMISSED
    | ExchangePromoEvents.EXCHANGE_AWARENESS_PROMPT_CLICKED
  properties: {
    current_origin: 'Wallet-Prompt'
    sso_user: boolean
  }
}

type Shown = {
  key: ExchangePromoEvents.EXCHANGE_AWARENESS_PROMPT_SHOWN
  properties: ClickedOrDismissed['properties'] & { user_eligible_for_prompt: true }
}

export type ExchangePromoActions = ClickedOrDismissed | Shown
