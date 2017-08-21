import * as T from './actionTypes'

export const fetchAdverts = (number) => ({ type: T.FETCH_ADVERTS, payload: { number } })
export const fetchAdvertsSuccess = (data) => ({ type: T.FETCH_ADVERTS_SUCCESS, payload: data })
export const fetchAdvertsError = (data) => ({ type: T.FETCH_ADVERTS_ERROR, payload: data })
export const deleteAdverts = () => ({ type: T.DELETE_ADVERTS })
