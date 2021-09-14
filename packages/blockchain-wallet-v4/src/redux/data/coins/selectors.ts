import { RootState } from 'data/rootReducer'

import Remote from '../../../remote'
import * as selectors from '../../selectors'

export const getCustodialCoins = () => {
  return Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.products.includes('CustodialWalletBalance') &&
      !window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.type.name !== 'FIAT'
  )
}

export const getNonCustodialCoins = () => {
  return Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.type.name !== 'FIAT'
  )
}

export const getAllCoins = () => {
  return Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.name !== 'FIAT')
}

export const getRates = (coin: string, state: RootState) => {
  const walletCurrency = selectors.settings.getCurrency(state).getOrElse('USD')

  return state.dataPath.coins.rates.map((rates) => {
    return rates[`${coin}-${walletCurrency}`] || Remote.NotAsked
  })
}

export const getIsServicePriceDown = (state: RootState) => {
  return state.dataPath.coins.rates.cata({
    Failure: () => true,
    Loading: () => false,
    NotAsked: () => false,
    Success: () => false
  })
}

export const getTransactions = (coin: string, state: RootState) => {
  return state.dataPath.coins.transactions[coin] || []
}

export const getTransactionsAtBound = (coin: string, state: RootState) => {
  return state.dataPath.coins.transactions_at_bound[coin] || false
}
