import { CoinType } from 'core/types'
import { curry } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getPaymentsAccountExchange = curry(
  (currency: CoinType, state: RootState) => {
    return state.components.send.exchangePaymentsAccount[currency].map(
      x => x.address
    )
  }
)
