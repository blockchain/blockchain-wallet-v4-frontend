import * as AT from './actionTypes'
import { CoinType, SBCoreActionTypes } from 'core/types'

export const setNextSBTransactionsUrl = (
  coin: CoinType,
  next: string | null
): SBCoreActionTypes => ({
  payload: {
    coin,
    next
  },
  type: AT.SET_NEXT_SB_TRANSACTIONS_URL
})
