import { path } from 'ramda'
import { RootState } from 'data/rootReducer'

export const getGoals = (state: RootState) => state.goals.goals
export const getInitialModals = path(['goals', 'initialModals'])
export const getInitialModalDisplayed = path(['goals', 'initialModalDisplayed'])
