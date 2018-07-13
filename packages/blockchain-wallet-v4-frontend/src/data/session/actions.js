import * as AT from './actionTypes.js'

export const saveSession = payload => ({ type: AT.SAVE_SESSION, payload })

export const removeSession = payload => ({ type: AT.REMOVE_SESSION, payload })
