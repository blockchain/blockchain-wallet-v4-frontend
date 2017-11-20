import * as AT from './actionTypes'
export const createOrder = ({ depositAmount, pair, returnAddress, withdrawal }) => ({ type: AT.CREATE_ORDER, payload: { depositAmount, pair, returnAddress, withdrawal } })
