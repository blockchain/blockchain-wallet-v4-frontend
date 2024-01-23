import { RootState } from 'data/rootReducer'

export const getGoals = (state: RootState) => state.goals.goals
export const getInitialModals = (state: RootState) => state.goals.initialModals
export const getInitialRedirect = (state: RootState) => state.goals.initialRedirect
export const getInitialModalDisplayed = (state: RootState) => state.goals.initialModalDisplayed
