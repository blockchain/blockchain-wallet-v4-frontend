import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.recurringBuy.step
export const getMethods = (state: RootState) => state.components.recurringBuy.methods

export default getStep
