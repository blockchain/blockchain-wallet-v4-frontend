import { take, map, sequence, prop, takeLast, curry, compose, descend, sort } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const transform = curry((coin, transaction) => {
  return {
    type: 'transaction',
    time: transaction.time * 1000,
    amount: transaction.amount,
    action: transaction.type,
    coin: coin
  }
})
export const getData = (state, number) => {
  let activities = selectors.core.settings.getLoggingLevel(state).getOrElse(false)
    ? selectors.core.data.misc.getLogs(state).map(take(number))
    : Remote.of([])

  const btcTransactions = selectors.core.common.bitcoin.getWalletTransactions(state)
  if (btcTransactions[0] !== undefined) {
    const b = btcTransactions[0].map(compose(take(number), map(transform('BTC'))))
    activities = sequence(Remote.of, [activities, b]).map(([a, b]) => a.concat(b))
  }

  const bchTransactions = selectors.core.common.bch.getWalletTransactions(state)
  if (bchTransactions[0] !== undefined) {
    const b = bchTransactions[0].map(compose(take(number), map(transform('BCH'))))
    activities = sequence(Remote.of, [activities, b]).map(([a, b]) => a.concat(b))
  }

  const ethTransactions = selectors.core.common.ethereum.getTransactions(state)
  const b = ethTransactions.map(compose(take(number), map(transform('ETH'))))
  activities = sequence(Remote.of, [activities, b]).map(([a, b]) => a.concat(b))

  return activities.map(sort(descend(prop('time')))).map(take(number))
}

export const getEthereumContext = selectors.core.kvStore.ethereum.getContext
