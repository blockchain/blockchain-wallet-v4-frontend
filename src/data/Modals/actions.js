import * as AT from './actionTypes'

export const closeModal = () => ({ type: AT.CLOSE_MODAL })

export const showModalRequestBitcoinStep1 = payload => ({ type: AT.SHOW_MODAL_REQUEST_BITCOIN_STEP1 })

export const showModalRequestBitcoinStep2 = payload => ({ type: AT.SHOW_MODAL_REQUEST_BITCOIN_STEP2 })

export const showModalRequestBitcoinQRCode = payload => ({ type: AT.SHOW_MODAL_REQUEST_BITCOIN_QRCODE })
