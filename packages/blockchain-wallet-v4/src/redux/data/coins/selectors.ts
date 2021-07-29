import { RootState } from 'data/rootReducer'

import Remote from '../../../remote'

export const getCoins = () => {
  return Object.keys(window.coins).filter(
    (coin) =>
      !window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.products.includes('CustodialWalletBalance')
  )
}

export const getRates = (coin: string, state: RootState) => {
  return state.dataPath.coins.rates[coin] || Remote.NotAsked
}

export const getTransactions = (state: RootState) => {
  return state.dataPath.algo.transactions
}

export const getTransactionsAtBound = (state: RootState) => {
  return state.dataPath.algo.transactions_at_bound
}
