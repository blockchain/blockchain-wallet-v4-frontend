import { ModalNameType, ModalParamPropsType } from 'data/modals/types'

import * as AT from './actionTypes'
import { GoalsType } from './types'

const generateId = () => Math.random().toString(36).substr(2, 10)

export const saveGoal = (name: GoalsType, data) => ({
  payload: { data, id: generateId(), name },
  type: AT.SAVE_GOAL
})
export const deleteGoal = (id: string) => ({
  payload: { id },
  type: AT.DELETE_GOAL
})
export const addInitialModal = (key: string, name: ModalNameType, data: ModalParamPropsType) => ({
  payload: { data, key, name },
  type: AT.ADD_INITIAL_MODAL
})
export const addInitialRedirect = (path: string) => ({
  payload: { path },
  type: AT.ADD_INITIAL_REDIRECT
})
export const initialModalDisplayed = {
  type: AT.INITIAL_MODAL_DISPLAYED
}

export const runGoals = () => ({ type: AT.RUN_GOALS })
export const defineGoals = () => ({ type: AT.DEFINE_GOALS })
