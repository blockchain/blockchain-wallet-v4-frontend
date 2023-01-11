import { CoinType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getIsUserEligible = (state: RootState) => state.components.dex.isUserEligible

export const getChains = (state: RootState) => state.components.dex.chains

export const getCurrentChain = (state: RootState) => state.components.dex.currentChain

export const getCurrentChainTokens = (state: RootState) => state.components.dex.currentChainTokens
export const getCurrentChainTokensMeta = (state: RootState) =>
  state.components.dex.currentChainTokensMeta

export const getChainTokenInfo = (state: RootState, coinSymbol: CoinType) =>
  getCurrentChainTokens(state).map((tokenList) => tokenList.find((x) => x.symbol === coinSymbol))

export const getSwapQuote = (state: RootState) => state.components.dex.swapQuote

export const getDexCoinBalanceToDisplay =
  (coinSymbol: CoinType | undefined) => (state: RootState) => {
    const balance = coinSymbol
      ? selectors.balances.getCoinNonCustodialBalance(coinSymbol)(state)
      : null
    return balance ? balance.getOrElse(0) : 0
  }
