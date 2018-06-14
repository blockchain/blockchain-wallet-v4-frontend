import * as T from './actionTypes'

export const startSocket = () => ({ type: T.START_SOCKET })
export const stopSocket = () => ({ type: T.STOP_SOCKET })

export const openSocket = () => ({ type: T.OPEN_SOCKET })
export const messageSocket = (payload) => ({ type: T.MESSAGE_SOCKET, payload })
export const closeSocket = () => ({ type: T.CLOSE_SOCKET })

export const paymentReceived = (message) => ({type: T.ETH_PAYMENT_RECEIVED, message})
