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

export const authenticateSocket = () => ({ type: AT.AUTHENTICATE_SOCKET })

export const openAdviceChannel = (pair, volume, fix, fiatCurrency) => ({
  type: AT.OPEN_ADVICE_CHANNEL,
  payload: { pair, volume, fix, fiatCurrency }
})
export const closeAdviceChannel = pair => ({
  type: AT.CLOSE_ADVICE_CHANNEL,
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
