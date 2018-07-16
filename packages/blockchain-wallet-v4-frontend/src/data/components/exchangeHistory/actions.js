import * as AT from './actionTypes'

export const initialized = trades => ({
  type: AT.EXCHANGE_HISTORY_INITIALIZED,
  payload: { trades }
})

export const destroyed = () => ({ type: AT.EXCHANGE_HISTORY_DESTROYED })

export const modalInitialized = depositAddress => ({
  type: AT.EXCHANGE_HISTORY_MODAL_INITIALIZED,
  payload: { depositAddress }
})

export const modalDestroyed = () => ({
  type: AT.EXCHANGE_HISTORY_MODAL_DESTROYED
})
