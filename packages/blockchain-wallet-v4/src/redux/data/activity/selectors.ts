import moment from 'moment'

import {
  InterestTransactionType,
  SBOrderType,
  SBTransactionType
} from 'core/types'
import { NabuProducts } from './types'
import { RootState } from 'data/rootReducer'

export const getActivity = (state: RootState) => state.dataPath.activity

export const getCustodialTransactions = (state: RootState) => {
  const items: Array<
    SBTransactionType | InterestTransactionType | SBOrderType
  > = []
  for (const value of NabuProducts) {
    items.push(...state.dataPath.activity[value].transactions.items)
  }

  return items.sort(
    (a, b) => moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
  )
}
