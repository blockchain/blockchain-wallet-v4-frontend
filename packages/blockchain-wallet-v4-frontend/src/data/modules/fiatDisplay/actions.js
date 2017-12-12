import * as AT from './actionTypes'

export const initFiatDisplay = (coin) => ({ type: AT.INIT_FIAT_DISPLAY, payload: { coin } })
