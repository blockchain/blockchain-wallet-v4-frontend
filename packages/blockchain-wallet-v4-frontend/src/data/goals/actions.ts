import * as AT from './actionTypes'
import { ModalNamesType } from 'data/modals/types'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

export const saveGoal = (name, data) => ({
  type: AT.SAVE_GOAL,
  payload: { id: generateId(), name, data }
})
export const deleteGoal = id => ({ type: AT.DELETE_GOAL, payload: { id } })
export const addInitialModal = (
  key: string,
  name: ModalNamesType,
  data?: any
) => ({
  type: AT.ADD_INITIAL_MODAL,
  payload: { key, name, data }
})
export const initialModalDisplayed = {
  type: AT.INITIAL_MODAL_DISPLAYED
}

export const runGoals = () => ({ type: AT.RUN_GOALS })
export const defineGoals = () => ({ type: AT.DEFINE_GOALS })
