export enum PlaidClientEvents {
  PLAID_CLICK_OUTSIDE = 'User Clicked Outside Plaid Flyout',
  PLAID_ERROR = 'Error Linking With Plaid'
}

type PlaidLinkingError = {
  key: PlaidClientEvents.PLAID_ERROR
  properties: {
    error_code: string
    error_event_type: string
    error_message: string
    error_type: string
    institution_id: string
    institution_name: string
    link_session_id: string
  }
}

type PlaidClickedOutside = {
  key: PlaidClientEvents.PLAID_CLICK_OUTSIDE
  properties: {
    buy_sell_step: string
    modal_step: string
    origin: string
  }
}

export type PlaidClientActions = PlaidClickedOutside | PlaidLinkingError
