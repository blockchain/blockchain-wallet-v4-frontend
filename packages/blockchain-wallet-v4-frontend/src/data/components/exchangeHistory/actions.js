import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.EXCHANGE_HISTORY_INITIALIZED })

export const modalInitialized = (depositAddress) => ({ type: AT.EXCHANGE_HISTORY_MODAL_INITIALIZED, payload: { depositAddress } })

export const modalDestroyed = () => ({ type: AT.EXCHANGE_HISTORY_MODAL_DESTROYED })
