import * as AT from './actionTypes'

export const generateAddress = password => ({
  type: AT.GENERATE_ADDRESS,
  payload: { password }
})

export const setAddress = address => ({
  type: AT.SET_ADDRESS,
  payload: { address }
})

export const fetchData = () => ({ type: AT.FETCH_DATA })
