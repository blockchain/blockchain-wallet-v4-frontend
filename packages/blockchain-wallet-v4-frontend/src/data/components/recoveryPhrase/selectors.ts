import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) =>
  state.components.recoveryPhrase.step
