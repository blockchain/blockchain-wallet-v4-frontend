import { CoinType } from '@core/types'
import { ToastNatureType } from 'blockchain-info-components'

// types
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
