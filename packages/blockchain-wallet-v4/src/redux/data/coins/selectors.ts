import { RootState } from 'data/rootReducer'

import Remote from '../../../remote'

export const getCoins = () => {
  return Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.products.includes('CustodialWalletBalance') &&
      !window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.type.name !== 'FIAT'
  )
}

export const getRates = (coin: string, state: RootState) => {
  return state.dataPath.coins.rates[coin] || Remote.NotAsked
}

export const getTransactions = (coin: string, state: RootState) => {
  return state.dataPath.coins.transactions[coin] || []
}

export const getTransactionsAtBound = (coin: string, state: RootState) => {
  return state.dataPath.coins.transactions_at_bound[coin] || false
}
