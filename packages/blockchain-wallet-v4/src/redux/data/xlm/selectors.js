import {
  compose,
  curry,
  find,
  lift,
  map,
  identity,
  memoizeWith,
  path,
  prop,
  propOr,
  propEq,
  sum
} from 'ramda'

import { dataPath } from '../../paths'
import * as Exchange from '../../../exchange'
import { createDeepEqualSelector } from '../../../utils'
import * as kvStoreSelectors from '../../kvStore/xlm/selectors'
import { getLockboxXlmContext } from '../../kvStore/lockbox/selectors'
import Remote from '../../../remote'

const getLedgerDetails = path([dataPath, 'xlm', 'ledgerDetails'])

export const getContext = createDeepEqualSelector(
  [kvStoreSelectors.getContext, getLockboxXlmContext],
  (walletContextR, lockboxContextR) => {
    const walletContext = walletContextR.getOrElse([])
    const lockboxContext = lockboxContextR.getOrElse([])
    return walletContext.concat(lockboxContext)
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

export const getHeight = compose(
  prop('sequence'),
  getLedgerDetails
)

export const getNumberOfEntries = curry(
  compose(
    lift(prop('subentry_count')),
    getAccount
  )
)

export const selectBalanceFromAccount = compose(
  prop('balance'),
  find(propEq('asset_type', 'native')),
  prop('balances')
)

export const getAccountBalance = compose(
  lift(selectBalanceFromAccount),
  getAccount
)

const calculateBalance = memoizeWith(
  identity,
  balance =>
    Exchange.convertCoinToCoin({
      value: balance,
      coin: 'XLM',
      baseToStandard: false
    }).value
)

export const getBalance = curry(
  compose(
    lift(
      compose(
        calculateBalance,
        prop('balance'),
        find(propEq('asset_type', 'native')),
        propOr([], 'balances')
      )
    ),
    getAccount
  )
)

export const getTotalBalance = state =>
  compose(
    Remote.of,
    sum,
    map(accountId => getBalance(accountId, state).getOrElse(0)),
    getContext
  )(state)

export const getRates = path([dataPath, 'xlm', 'rates'])

export const getTransactionsAtBound = path([
  dataPath,
  'xlm',
  'transactionsAtBound'
])

export const getTransactions = path([dataPath, 'xlm', 'transactions'])
export const getOperations = path([dataPath, 'xlm', 'operations'])
