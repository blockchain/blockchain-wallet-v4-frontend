import { assoc, compose, curry, map, prop } from 'ramda'
import { getBalance } from '../../data/xlm/selectors'
import { getAccounts } from '../../kvStore/xlm/selectors'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

const digest = type => ({ label, balance, addr }) => ({
  coin: 'XLM',
  label,
  balance,
  address: addr,
  type
})
const addBalance = curry((state, account) =>
  assoc('balance', getBalance(account.addr, state), account)
)

export const getAccountBalances = state =>
  getAccounts(state).map(
    compose(
      map(addBalance(state)),
      map(digest(ADDRESS_TYPES.ACCOUNT))
    )
  )

export const getLockboxXlmBalances = state =>
  getLockboxXlmAccounts(state).map(
    compose(
      map(addBalance(state)),
      map(digest(ADDRESS_TYPES.LOCKBOX))
    )
  )

export const getAccountsInfo = state => {
  const digest = account => ({
    coin: 'XLM',
    label: prop('label', account),
    address: prop('addr', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
// TODO: get xlm transactions
export const getWalletTransactions = state => {
  // const accountsR = getAccounts(state)
  // const blockHeightR = getHeight(state)
  // const addressesR = accountsR.map(map(prop('addr')))
  // const lockboxContextR = getLockboxEthContext(state)
  // const pages = getTransactions(state)
  // const getPartnerLabel = hash => getShapeshiftTxHashMatch(state, hash)
  // const ProcessTxs = (addresses, lockboxContext, blockHeight, txList) => {
  //   const ethAddresses = concat(addresses, lockboxContext)
  //   return map(
  //     transformTx(ethAddresses, blockHeight, getPartnerLabel, state),
  //     txList
  //   )
  // }
  // const ProcessPage = lift(ProcessTxs)(
  //   addressesR,
  //   lockboxContextR,
  //   blockHeightR
  // )
  // return map(ProcessPage, pages)
}
