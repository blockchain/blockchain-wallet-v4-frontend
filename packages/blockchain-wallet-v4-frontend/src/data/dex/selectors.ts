import { RootState } from 'data/rootReducer'

export function getChains(state: RootState) {
  return state.dex.chains
}

export function getCurrentChainId(state: RootState) {
  return state.dex.currentChain?.chainId
}
