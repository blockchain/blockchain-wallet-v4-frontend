import { CoinType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getIsUserEligible = (state: RootState) => state.components.dex.isUserEligible

export const getChains = (state: RootState) => state.components.dex.chains

export const getCurrentChain = (state: RootState) => state.components.dex.currentChain

export const getTokens = (state: RootState) => state.components.dex.tokens

export const getTokenInfo = (state: RootState, coinSymbol: CoinType) =>
  getTokens(state).find(({ symbol }) => symbol === coinSymbol)

export const getSwapQuote = (state: RootState) => state.components.dex.swapQuote

export const getDexCoinBalanceToDisplay =
  (coinSymbol: CoinType | undefined) => (state: RootState) => {
    const balance = coinSymbol
      ? selectors.balances.getCoinNonCustodialBalance(coinSymbol)(state)
      : null
    return balance ? balance.getOrElse(0) : 0
  }

export const getTokenAllowanceStatus = (state: RootState) => state.components.dex.isTokenAllowed
export const getTokenAllowanceTx = (state: RootState) => state.components.dex.tokenAllowanceTx
export const getTokenAllowanceGasEstimate = (state: RootState) =>
  state.components.dex.tokenAllowanceGasEstimate

export const getTokenAllowanceStatusAfterPolling = (state: RootState) =>
  state.components.dex.isTokenAllowedAfterPolling

export const getSwapQuoteTx = (state: RootState) => state.components.dex.swapQuoteTx

export const getSwapSideType = (state: RootState) => state.components.dex.swapSideType
