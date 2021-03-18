import { head, last, map, not, reject, toPairs } from 'ramda'

import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'

export const getData = state => {
  const balances = getAllCoinsBalancesSelector(state)

  // returns all coins with balances as a list
  // TODO: this should be sorted by fiat value
  // @ts-ignore
  return reject(
    not,
    map(x => last(x) !== '0' && head(x), toPairs(balances))
  )
}
