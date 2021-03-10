import { CoinType } from 'blockchain-wallet-v4/src/types'

// types
export type AlertNatureType = 'info' | 'warn' | 'success' | 'error'

export type AlertType = {
  coin?: CoinType
  data?: any
  id: string
  message: string
  nature: AlertNatureType
  persist?: boolean
}

// state
export type AlertsState = Array<AlertType>
