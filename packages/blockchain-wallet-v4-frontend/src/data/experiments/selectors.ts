import { RootState } from 'data/rootReducer'

export const get = (state: RootState) => state.experiments.data
