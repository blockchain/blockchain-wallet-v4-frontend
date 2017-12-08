import * as AT from './actionTypes'

export const initExchange = () => ({ type: AT.INIT_EXCHANGE })

export const createOrder = ({ depositAmount, pair, returnAddress, withdrawal }) => ({ type: AT.CREATE_ORDER, payload: { depositAmount, pair, returnAddress, withdrawal } })

export const resetExchange = () => ({ type: AT.RESET_EXCHANGE })
