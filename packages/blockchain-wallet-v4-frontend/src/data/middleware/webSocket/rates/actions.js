import * as AT from './actionTypes'

export const startSocket = () => ({ type: AT.START_SOCKET })
export const stopSocket = () => ({ type: AT.STOP_SOCKET })

export const openSocket = () => ({ type: AT.OPEN_SOCKET })
export const messageSocket = (message) => ({
  payload: { message },
  type: AT.MESSAGE_SOCKET
})
export const closeSocket = () => ({ type: AT.CLOSE_SOCKET })
export const restFallback = () => ({ type: AT.REST_FALLBACK })

export const authenticateSocket = () => ({ type: AT.AUTHENTICATE_SOCKET })

export const openRatesChannel = (pairs) => ({
  payload: { pairs },
  type: AT.OPEN_RATES_CHANNEL
})
export const closeRatesChannel = () => ({
  type: AT.CLOSE_RATES_CHANNEL
})

export const openAdviceChannel = (pair, volume, fix, fiatCurrency) => ({
  payload: { fiatCurrency, fix, pair, volume },
  type: AT.OPEN_ADVICE_CHANNEL
})
export const closeAdviceChannel = (pair) => ({
  payload: { pair },
  type: AT.CLOSE_ADVICE_CHANNEL
})

export const adviceSubscribeSuccess = (pair) => ({
  payload: { pair },
  type: AT.ADVICE_SUBSCRIBE_SUCCESS
})
export const adviceUnsubscribeSuccess = (pair) => ({
  payload: { pair },
  type: AT.ADVICE_UNSUBSCRIBE_SUCCESS
})
export const adviceSubscribeError = (pair, error) => ({
  payload: { error, pair },
  type: AT.ADVICE_SUBSCRIBE_ERROR
})

export const ratesSubscribeSuccess = (pairs) => ({
  payload: { pairs },
  type: AT.RATES_SUBSCRIBE_SUCCESS
})
export const ratesUnsubscribeSuccess = (pairs) => ({
  payload: { pairs },
  type: AT.RATES_UNSUBSCRIBE_SUCCESS
})
export const ratesSubscribeError = (pairs, error) => ({
  payload: { error, pairs },
  type: AT.RATES_SUBSCRIBE_ERROR
})
