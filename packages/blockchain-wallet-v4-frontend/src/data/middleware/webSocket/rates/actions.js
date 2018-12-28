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

export const openRatesChannel = pairs => ({
  type: AT.OPEN_RATES_CHANNEL,
  payload: { pairs }
})
export const closeRatesChannel = () => ({
  type: AT.CLOSE_RATES_CHANNEL
})

export const openAdviceChannel = (pair, volume, fix, fiatCurrency) => ({
  type: AT.OPEN_ADVICE_CHANNEL,
  payload: { pair, volume, fix, fiatCurrency }
})
export const closeAdviceChannel = pair => ({
  type: AT.CLOSE_ADVICE_CHANNEL,
  payload: { pair }
})
