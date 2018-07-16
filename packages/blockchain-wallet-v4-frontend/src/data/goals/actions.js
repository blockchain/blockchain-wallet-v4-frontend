import * as AT from './actionTypes'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

export const saveGoal = (name, data) => ({
  type: AT.SAVE_GOAL,
  payload: { id: generateId(), name, data }
})

export const deleteGoal = id => ({ type: AT.DELETE_GOAL, payload: { id } })

export const runGoals = () => ({ type: AT.RUN_GOALS })
