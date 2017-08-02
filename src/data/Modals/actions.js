import * as AT from './actionTypes'

export const closeModal = () => ({ type: AT.CLOSE_MODAL })

export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })

export const showModal = (type, props = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props } })

export const showModalAutoDisconnection = (duration) => showModal('AutoDisconnection', { duration })

export const showModalRequestBitcoin = () => showModal('RequestBitcoin')

export const showModalSendBitcoin = () => showModal('SendBitcoin')

export const showModalQRCode = (address, handleBack) => showModal('QRCode', { address, handleBack })

export const showModalQRCodeCapture = () => showModal('QRCodeCapture')

export const showModalSecondPassword = (handleConfirm) => showModal('SecondPassword', { handleConfirm })

export const sendQrCaptureResult = (result) => ({ type: AT.CAPTURE_QR_SUCCESS, payload: result })
export const sendQrCaptureError = (error) => ({ type: AT.CAPTURE_QR_ERROR, payload: error })
