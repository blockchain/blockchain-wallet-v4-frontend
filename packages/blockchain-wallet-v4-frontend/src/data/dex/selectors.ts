import { RootState } from 'data/rootReducer'

export function getChains(state: RootState) {
  return state.dex.chains
}

export function getCurrentChain(state: RootState) {
  return state.dex.currentChain
}

export function getCurrentChainTokens(state: RootState) {
  return state.dex.currentChainTokens
}
