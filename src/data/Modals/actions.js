import * as AT from './actionTypes'

export const closeModal = () => ({ type: AT.CLOSE_MODAL })

export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })

export const showModalAutoDisconnection = (duration) => ({ type: AT.SHOW_MODAL_AUTO_DISCONNECTION, payload: { duration } })

export const showModalRequestBitcoin = () => ({ type: AT.SHOW_MODAL_REQUEST_BITCOIN })

export const showModalSendBitcoin = () => ({ type: AT.SHOW_MODAL_SEND_BITCOIN })

export const showModalQRCode = (address, handleBack) => ({ type: AT.SHOW_MODAL_QR_CODE, payload: { address, handleBack } })

export const showModalQRCodeCapture = (handleScan, handleError, handleBack) => ({ type: AT.SHOW_MODAL_QR_CODE_CAPTURE, payload: { handleScan, handleError, handleBack } })

export const showModalSecondPassword = (handleConfirm) => ({ type: AT.SHOW_MODAL_SECOND_PASSWORD, payload: { handleConfirm } })
