import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.recurringBuy.step

export default getStep
