import {
  assoc,
  compose,
  concat,
  curry,
  filter,
  lift,
  map,
  prop,
  unnest
} from 'ramda'

import { createDeepEqualSelector } from '../../../../../blockchain-wallet-v4-frontend/src/services/ReselectHelper'
import { getBalance, getTransactions } from '../../data/xlm/selectors'
import { getAccounts, getXlmTxNotes } from '../../kvStore/xlm/selectors'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'
import { xlm } from '../../../transactions'
import { ADDRESS_TYPES } from '../../payment/btc/utils'

const { transformTx, decodeOperations, isLumenOperation } = xlm

const digest = type => ({ label, publicKey }) => ({
  coin: 'XLM',
  label,
  address: publicKey,
  type
})
const addBalance = curry((state, account) =>
  assoc('balance', getBalance(account.address, state).getOrElse(0), account)
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
    address: prop('publicKey', account)
  })
  return getAccounts(state).map(map(digest))
}

// getWalletTransactions :: state -> Remote([ProcessedTx])
export const getWalletTransactions = createDeepEqualSelector(
  [getAccounts, getLockboxXlmAccounts, getTransactions, getXlmTxNotes],
  (accountsR, lockboxAccountsR, pages, txNotesR) => {
    const processTxs = (walletAccounts, lockboxAccounts, txNotes, txList) => {
      const accounts = concat(walletAccounts, lockboxAccounts)
      return unnest(
        map(tx => {
          const operations = decodeOperations(tx)
          return compose(
            filter(prop('belongsToWallet')),
            map(transformTx(accounts, tx, txNotes)),
            filter(isLumenOperation)
          )(operations)
        }, txList)
      )
    }
    const ProcessPage = lift(processTxs)(accountsR, lockboxAccountsR, txNotesR)
    return map(ProcessPage, pages)
  }
)
