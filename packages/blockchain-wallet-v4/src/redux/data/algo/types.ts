import { RatesType } from 'data/types'
import { RemoteDataType } from 'core/types'

// state
export type AlgoState = {
  rates: RemoteDataType<string, RatesType>
  transactions: Array<any>
  transactions_at_bound: boolean
}

// actions
