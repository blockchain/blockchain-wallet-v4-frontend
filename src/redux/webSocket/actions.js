import * as T from './actionTypes'

export const openSocket = () =>
  ({ type: T.OPEN_SOCKET })
export const messageSocket = (payload) =>
  ({ type: T.MESSAGE_SOCKET, payload })
export const closeSocket = () =>
  ({ type: T.CLOSE_SOCKET })
