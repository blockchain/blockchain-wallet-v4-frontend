import memoize from 'fast-memoize'
import { curry } from 'ramda'

import { RootState } from 'data/rootReducer'

import Remote from '../../../remote'
import * as selectors from '../../selectors'

const _getCustodialCoins = (): Array<string> =>
  Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.products.includes('CustodialWalletBalance') &&
      !window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.type.name !== 'FIAT'
  )

const _getNonCustodialCoins = (): Array<string> =>
  Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.products.includes('PrivateKey') &&
      window.coins[coin].coinfig.type.name !== 'FIAT'
  )

const _getAllCoins = (): Array<string> =>
  Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.name !== 'FIAT')

const _getErc20Coins = (): Array<string> =>
  Object.keys(window.coins).filter(
    (coin) =>
      window.coins[coin].coinfig.type.name === 'ERC20' &&
      window.coins[coin].coinfig.type.parentChain === 'ETH'
  )

const _getFiatCoins = (): Array<string> =>
  Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.name === 'FIAT')

const _getDynamicSelfCustodyCoins = (): Array<string> =>
  Object.keys(window.coins).filter((coin) =>
    window.coins[coin].coinfig.products.includes('DynamicSelfCustody')
  )

// util function to ensure we only memoize coin selector functions when coin data exists
const memoizeWhenCoinsExist = (selectorFn): (() => Array<string>) => {
  if (!Object.keys(window.coins || {}).length) {
    return selectorFn
  }

  return memoize(selectorFn)
}

export const getDynamicSelfCustodyCoins: () => Array<string> = memoizeWhenCoinsExist(
  _getDynamicSelfCustodyCoins
)
export const getCustodialCoins: () => Array<string> = memoizeWhenCoinsExist(_getCustodialCoins)
export const getNonCustodialCoins: () => Array<string> =
  memoizeWhenCoinsExist(_getNonCustodialCoins)
export const getFiatCoins: () => Array<string> = memoizeWhenCoinsExist(_getFiatCoins)
export const getAllCoins: () => Array<string> = memoizeWhenCoinsExist(_getAllCoins)
export const getErc20Coins: () => Array<string> = memoizeWhenCoinsExist(_getErc20Coins)

export const getBalance = curry((coin: string, state: RootState) => {
  return state.dataPath.coins.balances[coin] || Remote.NotAsked
})

export const getRates = (coin: string, state: RootState) => {
  const walletCurrency = selectors.settings.getCurrency(state).getOrElse('USD')

  return state.dataPath.coins.rates.map((rates) => {
    return rates[`${coin}-${walletCurrency}`] || Remote.NotAsked
  })
}

export const getBtcTicker = (state: RootState) => {
  return state.dataPath.coins.btcTicker
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
