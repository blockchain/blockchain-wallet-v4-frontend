import * as AT from './actionTypes'

export const startSocket = () => ({ type: AT.START_SOCKET })
export const stopSocket = () => ({ type: AT.STOP_SOCKET })

export const openSocket = () => ({ type: AT.OPEN_SOCKET })
export const messageSocket = (payload) => ({ type: AT.MESSAGE_SOCKET, payload })
export const closeSocket = () => ({ type: AT.CLOSE_SOCKET })
