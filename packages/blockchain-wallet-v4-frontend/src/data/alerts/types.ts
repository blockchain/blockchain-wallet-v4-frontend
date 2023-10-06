import { CoinType } from '@core/types'

// types
export enum ToastNatureType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn'
}

export type AlertType = {
  coin?: CoinType
  data?: any
  id: string
  message: string
  nature: ToastNatureType
  persist?: boolean
}

// state
export type AlertsState = Array<AlertType>
