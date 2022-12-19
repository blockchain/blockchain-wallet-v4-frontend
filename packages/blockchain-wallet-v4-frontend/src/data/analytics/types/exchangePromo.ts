// Exchange Promo Events
export type Events =
  | 'Exchange Awareness Prompt Clicked'
  | 'Exchange Awareness Prompt Dismissed'
  | 'Exchange Awareness Prompt Shown'

type Clicked = {
  key: 'Exchange Awareness Prompt Clicked'
  properties: {
    current_origin: 'Wallet-Prompt'
    sso_user: boolean
  }
}

type Dismissed = {
  key: 'Exchange Awareness Prompt Dismissed'
  properties: {
    current_origin: 'Wallet-Prompt'
    sso_user: boolean
  }
}

type Shown = {
  key: 'Exchange Awareness Prompt Shown'
  properties: {
    current_origin: 'Wallet-Prompt'
    sso_user: boolean
    user_eligible_for_prompt: true
  }
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = Clicked | Dismissed | Shown
