import { RootState } from 'data/rootReducer'

export function getRuntime(state: RootState) {
  return state.misc.runtimeFile
}
