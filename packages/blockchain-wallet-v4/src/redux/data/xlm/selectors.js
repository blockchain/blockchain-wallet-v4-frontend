import {
  add,
  compose,
  curry,
  find,
  lift,
  map,
  memoize,
  path,
  prop,
  propEq,
  reduce
} from 'ramda'

import { dataPath } from '../../paths'
import * as Exchange from '../../../exchange'
import { calculateEffectiveBalance } from '../../../utils/xlm'
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

export const getAccount = curry((accountId, state) =>
  path([dataPath, 'xlm', 'data'], state).map(prop(accountId))
)

export const getBaseReserve = compose(
  lift(prop('base_reserve_in_stroops')),
  getLedgerDetails
)

export const getBaseFee = compose(
  lift(prop('base_fee_in_stroops')),
  getLedgerDetails
)

export const getNumberOfEntries = compose(
  lift(prop('subentry_count')),
  getAccount
)

export const getAccountBalance = compose(
  lift(
    compose(
      prop('balance'),
      find(propEq('asset_type', 'native')),
      prop('balances')
    )
  ),
  getAccount
)

const calculateBalance = memoize((balance, baseReserve, entries, baseFee) =>
  calculateEffectiveBalance(
    Exchange.convertCoinToCoin({
      value: balance,
      coin: 'XLM',
      baseToStandard: false
    }).value,
    baseReserve,
    entries,
    baseFee
  )
)

export const getBalance = curry((accountId, state) =>
  lift(calculateBalance)(
    getAccountBalance(accountId, state),
    getBaseReserve(state),
    getNumberOfEntries(accountId, state),
    getBaseFee(state)
  )
)

export const getTotalBalance = state =>
  compose(
    reduce(lift(add), Remote.of(0)),
    map(accountId => getBalance(accountId, state)),
    getContext
  )(state)

export const getRates = path([dataPath, 'xlm', 'rates'])
