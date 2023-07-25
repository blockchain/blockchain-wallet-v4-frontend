export enum Events {
  PLAID_ERROR = 'Error Linking With Plaid'
}

type PlaidLinkingError = {
  key: Events.PLAID_ERROR
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

export type TrackEventAction = PlaidLinkingError
