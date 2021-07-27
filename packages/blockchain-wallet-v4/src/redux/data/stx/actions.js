import * as AT from './actionTypes'

export const generateAddress = (password) => ({
  payload: { password },
  type: AT.GENERATE_ADDRESS
})

export const setAddress = (address) => ({
  payload: { address },
  type: AT.SET_ADDRESS
})

export const fetchData = () => ({ type: AT.FETCH_DATA })
