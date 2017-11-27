import * as T from './actionTypes'

export const update = (payload = {}) => ({ type: T.UPDATE_ROOT, payload })

export const set = (payload) => ({ type: T.SET_ROOT, payload })
