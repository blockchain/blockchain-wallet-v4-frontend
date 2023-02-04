import { assoc, compose, curry, map, prop } from 'ramda'

import { getAccounts } from '../../kvStore/xlm/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'
import * as selectors from '../../selectors'

const digest =
  (type) =>
  ({ label, publicKey }) => ({
    address: publicKey,
    coin: 'XLM',
    label,
    type
  })
const addBalance = curry((state, account) =>
  assoc('balance', selectors.data.coins.getCoinUnifiedBalance('XLM')(state).getOrElse(0), account)
)

export const getAccountBalances = (state) =>
  getAccounts(state).map(compose(map(addBalance(state)), map(digest(ADDRESS_TYPES.ACCOUNT))))

export const getAccountsInfo = (state) => {
  const digest = (account) => ({
    address: prop('publicKey', account),
    coin: 'XLM',
    label: prop('label', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = (state) => state.dataPath.xlm.transactions
