import { selectors } from 'data'
import { all, isEmpty } from 'ramda'

export const getAreThereBsvTransactions = state => {
  const txs = selectors.core.common.bsv.getWalletTransactions(state)
  const empty = page => isEmpty(page.data)
  return !all(empty)(txs)
}
