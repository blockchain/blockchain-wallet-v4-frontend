import {
  compose,
  converge,
  find,
  lift,
  memoize,
  path,
  prop,
  propEq
} from 'ramda'

import { dataPath } from '../../paths'
import * as Exchange from '../../../exchange'
import { calculateEffectiveBalance } from '../../../utils/xlm'

const getLedgerDetails = path([dataPath, 'xlm', 'ledgerDetails'])
const getAccount = path([dataPath, 'xlm', 'account'])

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

export const getBalance = converge(lift(calculateBalance), [
  getAccountBalance,
  getBaseReserve,
  getNumberOfEntries,
  getBaseFee
])

export const getRates = path([dataPath, 'xlm', 'rates'])
