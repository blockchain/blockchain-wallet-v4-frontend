import * as AT from './actionTypes'

export const saveGoal = (name, data) => ({ type: AT.SAVE_GOAL, payload: { name, data } })

export const runGoals = () => ({ type: AT.RUN_GOALS })
