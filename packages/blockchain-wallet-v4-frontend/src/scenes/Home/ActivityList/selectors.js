import { concat, isNil, take, map, lift, prop, curry, compose, descend, reduce, sort, unapply } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const transform = curry((coin, transaction) => ({
  type: 'transaction',
  time: transaction.time * 1000,
  path: `/${coin.toLowerCase()}/transactions`,
  amount: transaction.amount,
  action: transaction.type,
  coin: coin
}))

export const getNumber = () => 8

export const getLogs = createDeepEqualSelector(
  [selectors.core.settings.getLoggingLevel, selectors.core.data.misc.getLogs, getNumber],
  (level, logs, number) => level.getOrElse(false) ? logs.map(take(number)) : Remote.of([])
)

export const getBtcTransactions = createDeepEqualSelector(
  [selectors.core.common.btc.getWalletTransactions, getNumber],
  (transactions, number) => Remote.Success.is(transactions[0]) && !isNil(transactions[0]) ? transactions[0].map(compose(take(number), map(transform('BTC')))) : Remote.of([])
)

export const getBchTransactions = createDeepEqualSelector(
  [selectors.core.common.bch.getWalletTransactions, getNumber],
  (transactions, number) => Remote.Success.is(transactions[0]) && !isNil(transactions[0]) ? transactions[0].map(compose(take(number), map(transform('BCH')))) : Remote.of([])
)

export const getEthTransactions = createDeepEqualSelector(
  [selectors.core.common.eth.getWalletTransactions, getNumber],
  (transactions, number) => Remote.Success.is(transactions[0]) && !isNil(transactions[0]) ? transactions[0].map(compose(take(number), map(transform('ETH')))) : Remote.of([])
)

export const concatAll = unapply(reduce(concat, []))

export const getData = createDeepEqualSelector(
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
