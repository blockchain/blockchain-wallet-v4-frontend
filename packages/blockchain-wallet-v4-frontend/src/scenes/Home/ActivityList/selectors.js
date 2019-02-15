import {
  concat,
  isNil,
  take,
  map,
  lift,
  prop,
  curry,
  compose,
  descend,
  reduce,
  sort,
  unapply
} from 'ramda'
import moment from 'moment'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const transform = curry((coin, transaction) => ({
  type: 'transaction',
  time: transaction.time * 1000,
  timeFormatted: moment(transaction.time * 1000).format('ll'),
  path: `/${coin.toLowerCase()}/transactions`,
  watchOnly: transaction.fromWatchOnly || transaction.toWatchOnly,
  amount: transaction.amount,
  action: transaction.type,
  coin: coin
}))

export const getNumber = () => 8

export const getLogs = createDeepEqualSelector(
  [
    selectors.core.settings.getLoggingLevel,
    selectors.core.data.misc.getLogs,
    getNumber
  ],
  (level, logs, number) =>
    level.getOrElse(false) ? logs.map(take(number)) : Remote.of([])
)

export const getBtcTransactions = createDeepEqualSelector(
  [selectors.core.common.btc.getWalletTransactions, getNumber],
  (transactions, number) =>
    Remote.Success.is(transactions[0]) && !isNil(transactions[0])
      ? transactions[0].map(
          compose(
            take(number),
            map(transform('BTC'))
          )
        )
      : Remote.of([])
)

export const getBchTransactions = createDeepEqualSelector(
  [selectors.core.common.bch.getWalletTransactions, getNumber],
  (transactions, number) =>
    Remote.Success.is(transactions[0]) && !isNil(transactions[0])
      ? transactions[0].map(
          compose(
            take(number),
            map(transform('BCH'))
          )
        )
      : Remote.of([])
)

export const getEthTransactions = createDeepEqualSelector(
  [selectors.core.common.eth.getWalletTransactions, getNumber],
  (transactions, number) =>
    Remote.Success.is(transactions[0]) && !isNil(transactions[0])
      ? transactions[0].map(
          compose(
            take(number),
            map(transform('ETH'))
          )
        )
      : Remote.of([])
)

export const getXlmTransactions = createDeepEqualSelector(
  [selectors.core.common.xlm.getWalletTransactions, getNumber],
  (transactions, number) =>
    Remote.Success.is(transactions[0]) && !isNil(transactions[0])
      ? transactions[0].map(
          compose(
            take(number),
            map(transform('XLM'))
          )
        )
      : Remote.of([])
)

export const concatAll = unapply(reduce(concat, []))

export const getData = createDeepEqualSelector(
  [
    getLogs,
    getBtcTransactions,
    getBchTransactions,
    getEthTransactions,
    getXlmTransactions,
    getNumber
  ],
  (logs, btcR, bchR, ethR, xlmR, number) => {
    const transform = (logs, btc, bch, eth, xlm) => {
      const allActivities = concatAll(logs, btc, bch, eth, xlm)
      const filterByTime = sort(descend(prop('time')))
      const takeN = take(number)
      return compose(
        takeN,
        filterByTime
      )(allActivities)
    }
    return lift(transform)(logs, btcR, bchR, ethR, xlmR)
  }
)
