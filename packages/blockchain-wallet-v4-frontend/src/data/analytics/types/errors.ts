export enum Events {
  CLIENT_ERROR = 'Client Error'
}

type ErrorType =
  | 'OOPS_ERROR'
  | 'UNKNOWN_ERROR'
  | 'NABU_ERROR'
  | 'INSUFFICIENT_FUNDS'
  | 'BELOW_FEES'
  | 'BELOW_MINIMUM_LIMIT'
  | 'OVER_MAXIMUM_SOURCE_LIMIT'
  | 'OVER_MAXIMUM_PERSONAL_LIMIT'
  | 'ADDRESS_IS_CONTRACT'
  | 'INVALID_ADDRESS'
  | 'INVALID_PASSWORD'
  | 'OPTION_INVALID'
  | 'PENDING_ORDERS_LIMIT_REACHED'
  | 'TRANSACTION_IN_FLIGHT'
  | 'FATAL_ERROR'

type ErrorSource = 'CLIENT' | 'NABU' | 'UNKNOWN'

export type ClientErrorProperties = {
  action?: string
  category?: string[]
  error: ErrorType
  id?: string
  network_endpoint?: string
  network_error_code?: number
  network_error_description?: string
  network_error_id?: string
  network_error_type?: ErrorType
  source: ErrorSource
  title: string
}

export type PartialClientErrorProperties = Partial<ClientErrorProperties>

export type ClientErrorAction = {
  key: Events.CLIENT_ERROR
  properties: ClientErrorProperties
}

export type TrackEventAction = ClientErrorAction
