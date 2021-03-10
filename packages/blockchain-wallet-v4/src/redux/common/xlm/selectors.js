import { assoc, compose, curry, map, prop } from 'ramda'

import { getBalance } from '../../data/xlm/selectors'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'
import { getAccounts } from '../../kvStore/xlm/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

const digest = type => ({ label, publicKey }) => ({
  coin: 'XLM',
  label,
  address: publicKey,
  type
})
const addBalance = curry((state, account) =>
  assoc('balance', getBalance(state, account.address).getOrElse(0), account)
)

export const getAccountBalances = state =>
  getAccounts(state).map(
    compose(map(addBalance(state)), map(digest(ADDRESS_TYPES.ACCOUNT)))
  )

export const getLockboxXlmBalances = state =>
  getLockboxXlmAccounts(state).map(
    compose(map(addBalance(state)), map(digest(ADDRESS_TYPES.LOCKBOX)))
  )

export const getAccountsInfo = state => {
  const digest = account => ({
    coin: 'XLM',
    label: prop('label', account),
    address: prop('publicKey', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = state => state.dataPath.xlm.transactions
