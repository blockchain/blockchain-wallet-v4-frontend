import { RootState } from 'data/rootReducer'

export const getStep = (state: RootState) => state.components.recurringBuys.step

export default getStep
