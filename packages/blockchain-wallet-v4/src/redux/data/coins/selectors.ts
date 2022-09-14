import BigNumber from 'bignumber.js'
import memoize from 'fast-memoize'
import { lift } from 'ramda'

import { ExtractSuccess, RemoteDataType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
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
  Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.name === 'ERC20')

const _getFiatCoins = (): Array<string> =>
  Object.keys(window.coins).filter((coin) => window.coins[coin].coinfig.type.name === 'FIAT')

const _getDynamicSelfCustodyCoins = (): Array<string> =>
  Object.keys(window.coins).filter((coin) =>
    window.coins[coin].coinfig.products.includes('DynamicSelfCustody')
  )

// util function to ensure we only memoize coin selector functions when coin data exists
const memoizeWhenCoinsExist = (selectorFn): (() => Array<string>) => {
  if (Object.keys(window.coins || {}).length) {
    return () => []
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

export const getIsCoinDataLoaded = (state) => {
  return state.dataPath.coins.isCoinDataLoaded
}

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

export const getTransactionHistory = (coin: string, state: RootState) => {
  return state.dataPath.coins.transaction_history[coin] || Remote.NotAsked
}

export const getTransactionsAtBound = (coin: string, state: RootState) => {
  return state.dataPath.coins.transactions_at_bound[coin] || false
}

export const getUnifiedBalances = (state: RootState) => state.dataPath.coins.unifiedBalances

export const getCoinUnifiedBalance = (
  coin: string
): ((state: RootState) => RemoteDataType<string, BigNumber>) => {
  return (state: RootState) => {
    return createDeepEqualSelector(
      [selectors.data.coins.getUnifiedBalances],
      (unifiedBalancesR) => {
        let balance = new BigNumber(0)
        const transform = (unifiedBalances: ExtractSuccess<typeof unifiedBalancesR>) => {
          unifiedBalances
            .filter(({ ticker }) => ticker === coin)
            .forEach(({ amount }) => {
              balance = balance.plus(amount ? amount.amount : 0)
            })

          return balance
        }

        return lift(transform)(unifiedBalancesR)
      }
    )(state)
  }
}

export const getCoinNetworksAndTypes = () => ({
  networks: {
    AVAX: {
      identifiers: {
        chainId: 43114
      },
      name: 'Avalanche',
      nodeUrl: 'https://api.staging.blockchain.info/bnb/nodes/rpc',
      type: 'EVM'
    },
    'MATIC.MATIC': {
      identifiers: {
        chainId: 137
      },
      name: 'Polygon',
      nodeUrl: 'https://api.blockchain.info/matic-bor/nodes/rpc',
      type: 'EVM'
    }
  },
  types: {
    BTC: {
      derivations: [
        {
          coinType: 0,
          purpose: 44
        },
        {
          coinType: 0,
          purpose: 49
        },
        {
          coinType: 0,
          purpose: 84
        }
      ]
    },
    EVM: {
      derivations: [
        {
          coinType: 60,
          purpose: 44
        }
      ]
    },
    SOL: {
      derivations: [
        {
          coinType: 501,
          purpose: 44
        }
      ]
    }
  }
})
