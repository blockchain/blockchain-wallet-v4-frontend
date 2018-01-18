import * as T from './actionTypes'

export const startSocket = () => ({ type: T.START_SOCKET })
export const stopSocket = () => ({ type: T.STOP_SOCKET })

export const openSocket = () => ({ type: T.OPEN_SOCKET })
export const messageSocket = (payload) => ({ type: T.MESSAGE_SOCKET, payload })
export const closeSocket = () => ({ type: T.CLOSE_SOCKET })

export const onBlock = (block) => ({type: T.ON_BLOCK, block})
export const onTx = (tx) => ({type: T.ON_TX, tx})
