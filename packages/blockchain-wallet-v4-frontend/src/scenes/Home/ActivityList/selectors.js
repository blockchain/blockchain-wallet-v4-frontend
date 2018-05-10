import { isNil, take, flatten, map, lift, prop, curry, compose, descend, sort } from 'ramda'
import { selectors } from 'data'
import { createSelector } from 'reselect'
import { Remote } from 'blockchain-wallet-v4/src'
import { canBuy } from 'services/ExchangeService'

export const transform = curry((coin, transaction) => {
  return {
    type: 'transaction',
    time: transaction.time * 1000,
    amount: transaction.amount,
    action: transaction.type,
    coin: coin
  }
})

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
  [selectors.core.common.ethereum.getTransactions, getNumber],
  (transactions, number) => transactions.map(compose(take(number), map(transform('ETH'))))
)

export const getData = createSelector(
  [getLogs, getBtcTransactions, getBchTransactions, getEthTransactions, getNumber],
  (logs, btc, bch, eth, number) => {
    const transform = (logs, btc, bch, eth) => {
      return take(number, flatten([logs, btc, bch, eth].map(sort(descend(prop('time')))).map(take(number))))
    }
    return lift(transform)(logs, btc, bch, eth)
  }
)

export const getCanBuy = (state) => {
  const settingsR = selectors.core.settings.getSettings(state)
  const optionsR = selectors.core.walletOptions.getOptions(state)
  const buySellR = selectors.core.kvStore.buySell.getMetadata(state)

  const transform = (settings, options, buySell) => canBuy(settings, options, buySell)
  return lift(transform)(settingsR, optionsR, buySellR)
}
