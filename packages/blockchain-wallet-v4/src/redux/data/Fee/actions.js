import * as T from './actionTypes'

export const setFee = (data) => ({ type: T.SET_FEE, payload: data })

export const deleteFee = () => ({ type: T.DELETE_FEE })
