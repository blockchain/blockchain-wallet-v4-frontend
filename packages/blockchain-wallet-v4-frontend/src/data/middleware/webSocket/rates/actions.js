import * as AT from './actionTypes'

export const startSocket = () => ({ type: AT.START_SOCKET })
export const stopSocket = () => ({ type: AT.STOP_SOCKET })

export const openSocket = () => ({ type: AT.OPEN_SOCKET })
export const messageSocket = message => ({
  type: AT.MESSAGE_SOCKET,
  payload: { message }
})
export const closeSocket = () => ({ type: AT.CLOSE_SOCKET })
export const restFallback = () => ({ type: AT.REST_FALLBACK })

export const openChannelForPair = (pair, volume, fix, fiatCurrency) => ({
  type: AT.OPEN_CHANNEL_FOR_PAIR,
  payload: { pair, volume, fix, fiatCurrency }
})
export const closeChannelForPair = pair => ({
  type: AT.CLOSE_CHANNEL_FOR_PAIR,
  payload: { pair }
})

export const subscribeSuccess = pair => ({
  type: AT.SUBSCRIBE_SUCCESS,
  payload: { pair }
})
export const unsubscribeSuccess = pair => ({
  type: AT.UNSUBSCRIBE_SUCCESS,
  payload: { pair }
})
export const subscribeError = (pair, error) => ({
  type: AT.SUBSCRIBE_ERROR,
  payload: { pair, error }
})

export const updateAdvice = (pair, advice) => ({
  type: AT.UPDATE_ADVICE,
  payload: { pair, advice }
})
