import { RootState } from 'data/rootReducer'

export function getManifest(state: RootState) {
  return state.misc.manifestFile
}
