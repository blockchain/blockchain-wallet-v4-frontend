import { RootState } from 'data/rootReducer'

export function getDexChains(state: RootState) {
  return state.dex.chains
}
