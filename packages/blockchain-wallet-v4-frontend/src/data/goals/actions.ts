import { ModalNamesType, ModalParamPropsType } from 'data/modals/types'

import * as AT from './actionTypes'
import { GoalsType } from './types'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

export const saveGoal = (name: GoalsType, data) => ({
  type: AT.SAVE_GOAL,
  payload: { id: generateId(), name, data }
})
export const deleteGoal = (id: string) => ({
  type: AT.DELETE_GOAL,
  payload: { id }
})
export const addInitialModal = (
  key: string,
  name: ModalNamesType,
  data: ModalParamPropsType
) => ({
  type: AT.ADD_INITIAL_MODAL,
  payload: { key, name, data }
})
export const addInitialRedirect = (path: string) => ({
  type: AT.ADD_INITIAL_REDIRECT,
  payload: { path }
})
export const initialModalDisplayed = {
  type: AT.INITIAL_MODAL_DISPLAYED
}

export const runGoals = () => ({ type: AT.RUN_GOALS })
export const defineGoals = () => ({ type: AT.DEFINE_GOALS })
