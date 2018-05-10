import { concat, isNil, take, map, lift, prop, curry, compose, descend, reduce, sort, unapply } from 'ramda'
import { selectors } from 'data'
import { createSelector } from 'reselect'
import { Remote } from 'blockchain-wallet-v4/src'

export const transform = curry((coin, transaction) => ({
  type: 'transaction',
  time: transaction.time * 1000,
  amount: transaction.amount,
  action: transaction.type,
  coin: coin
}))

export const getNumber = () => 8

export const getLogs = createSelector(
  [selectors.core.settings.getLoggingLevel, selectors.core.data.misc.getLogs, getNumber],
  (level, logs, number) => level.getOrElse(false) ? logs.map(take(number)) : Remote.of([])
)

export const getBtcTransactions = createSelector(
  [selectors.core.common.bitcoin.getWalletTransactions, getNumber],
  (transactions, number) => isNil(transactions[0]) ? Remote.of([]) : transactions[0].map(compose(take(number), map(transform('BTC'))))
)

export const getBchTransactions = createSelector(
  [selectors.core.common.bch.getWalletTransactions, getNumber],
  (transactions, number) => isNil(transactions[0]) ? Remote.of([]) : transactions[0].map(compose(take(number), map(transform('BCH'))))
)

export const getEthTransactions = createSelector(
  [selectors.core.common.ethereum.getWalletTransactions, getNumber],
  (transactions, number) => isNil(transactions[0]) ? Remote.of([]) : transactions[0].map(compose(take(number), map(transform('ETH'))))
)

export const concatAll = unapply(reduce(concat, []))

export const getData = createSelector(
  [getLogs, getBtcTransactions, getBchTransactions, getEthTransactions, getNumber],
  (logs, btc, bch, eth, number) => {
    const transform = (logs, btc, bch, eth) => {
      const allActivities = concatAll(logs, btc, bch, eth)
      const filterByTime = sort(descend(prop('time')))
      const take8 = take(8)
      return compose(take8, filterByTime)(allActivities)
    }
    return lift(transform)(logs, btc, bch, eth)
  }
)
