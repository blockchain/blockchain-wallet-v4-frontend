import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getBtcTransactions = path([
  dataPath,
  'lockbox',
  'btc_transactions'
])
