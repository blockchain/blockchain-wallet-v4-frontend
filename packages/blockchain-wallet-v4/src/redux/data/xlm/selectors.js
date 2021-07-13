import {
  compose,
  curry,
  find,
  lift,
  map,
  path,
  prop,
  propEq,
  propOr,
  sum,
  uniq
} from 'ramda'

import * as Exchange from '../../../exchange'
import Remote from '../../../remote'
import { createDeepEqualSelector } from '../../../utils'
import { getLockboxXlmContext } from '../../kvStore/lockbox/selectors'
import * as kvStoreSelectors from '../../kvStore/xlm/selectors'
import { dataPath } from '../../paths'

const getLedgerDetails = path([dataPath, 'xlm', 'ledgerDetails'])

export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getContext, getLockboxXlmContext],
  (walletContextR, lockboxContextR) => {
    const walletContext = walletContextR.getOrElse([])
    const lockboxContext = lockboxContextR.getOrElse([])
    return uniq(walletContext.concat(lockboxContext))
  }
)

export const getAccounts = path([dataPath, 'xlm', 'data'])

export const getAccount = curry((accountId, state) =>
  propOr(Remote.NotAsked, accountId, getAccounts(state))
)

export const getBaseReserve = compose(
  lift(prop('base_reserve_in_stroops')),
  getLedgerDetails
)

export const getBaseFee = compose(
  lift(prop('base_fee_in_stroops')),
  getLedgerDetails
)

export const getHeight = compose(lift(prop('sequence')), getLedgerDetails)

export const getNumberOfEntries = curry(
  compose(lift(prop('subentry_count')), getAccount)
)

export const selectBalanceFromAccount = compose(
  prop('balance'),
  find(propEq('asset_type', 'native')),
  propOr([], 'balances')
)

export const getAccountBalance = compose(
  lift(selectBalanceFromAccount),
  getAccount
)

const calculateBalance = balance =>
  Exchange.convertCoinToCoin({
    value: balance,
    coin: 'XLM',
    baseToStandard: false
  }).value

export const getBalance = curry((state, accountId) =>
  compose(
    lift(compose(calculateBalance, selectBalanceFromAccount)),
    getAccount
  )(accountId, state)
)

export const getTotalBalance = state =>
  compose(
    Remote.of,
    sum,
    map(accountId => getBalance(state, accountId).getOrElse(0)),
    getContext
  )(state)

export const getRates = path([dataPath, 'xlm', 'rates'])

export const getTransactionsAtBound = path([
  dataPath,
  'xlm',
  'transactions_at_bound'
])

export const getTransactions = path([dataPath, 'xlm', 'transactions'])
export const getOperations = path([dataPath, 'xlm', 'operations'])

export const getTransactionHistory = path([
  dataPath,
  'xlm',
  'transaction_history'
])
