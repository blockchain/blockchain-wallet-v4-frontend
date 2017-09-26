import * as AT from './actionTypes'

// Generic
export const closeModal = () => ({ type: AT.CLOSE_MODAL })
export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })
export const showModal = (type, props = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props } })

// AutoDisconnection
export const clickAutoDisconnectionLogout = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_LOGOUT })
export const clickAutoDisconnectionCancel = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_CANCEL })

// MobileLogin
export const scanMobileLoginSuccess = (data) => ({ type: AT.SCAN_MOBILE_LOGIN_SUCCESS, payload: { data } })
export const scanMobileLoginError = (message) => ({ type: AT.SCAN_MOBILE_LOGIN_ERROR, payload: message })
export const clickMobileLoginCancel = () => ({ type: AT.CLICK_MOBILE_LOGIN_CANCEL })

// MobileNumberChange
export const clickMobileNumberChangeUpdate = () => ({ type: AT.CLICK_MOBILE_NUMBER_CHANGE_UPDATE })
export const clickMobileNumberChangeCancel = () => ({ type: AT.CLICK_MOBILE_NUMBER_CHANGE_CANCEL })

// MobileNumberVerify
export const clickMobileNumberVerifyValidate = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_VALIDATE })
export const clickMobileNumberVerifyResend = (mobileNumber) => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_RESEND, payload: { mobileNumber } })
export const clickMobileNumberVerifyChange = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_CHANGE })
export const clickMobileNumberVerifyCancel = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_CANCEL })

// QRCode
export const clickQRCodeCancel = () => ({ type: AT.CLICK_QRCODE_CANCEL })

// QRCodeCapture
export const scanQRCodeCaptureSuccess = (data) => ({ type: AT.SCAN_QRCODE_CAPTURE_SUCCESS, payload: { data } })
export const scanQRCodeCaptureError = (message) => ({ type: AT.SCAN_QRCODE_CAPTURE_ERROR, payload: message })
export const clickQRCodeCaptureCancel = () => ({ type: AT.CLICK_QRCODE_CAPTURE_CANCEL })

// RecoveryPhase
export const clickRecoveryPhraseFinish = () => ({ type: AT.CLICK_RECOVERY_PHASE_FINISH })

// RequestBitcoin
export const clickRequestBitcoinQRCode = (receiveAddress) => ({ type: AT.CLICK_REQUEST_BITCOIN_QRCODE, payload: { receiveAddress } })

// SendBitcoin
export const clickSendBitcoinSend = (selection) => ({ type: AT.CLICK_SEND_BITCOIN_SEND, payload: { selection } })

// TwoStepSetup
export const clickTwoStepSetupDisable = () => ({ type: AT.CLICK_TWO_STEP_SETUP_DISABLE })
export const clickTwoStepSetupMobile = () => ({ type: AT.CLICK_TWO_STEP_SETUP_MOBILE })
export const clickTwoStepSetupGoogleAuthenticator = () => ({ type: AT.CLICK_TWO_STEP_SETUP_GOOGLE_AUTHENTICATOR })
export const clickTwoStepSetupYubico = () => ({ type: AT.CLICK_TWO_STEP_SETUP_YUBICO })

// TwoStepGoogleAuthenticator
export const clickTwoStepGoogleAuthenticatorEnable = () => ({ type: AT.CLICK_TWO_STEP_GOOGLE_AUTHENTICATOR_ENABLE })

// TwoStepYubico Modal
export const clickTwoStepYubicoEnable = () => ({ type: AT.CLICK_TWO_STEP_YUBICO_ENABLE })

// UpgradeWallet Modal
export const clickUpgradeWalletContinue = () => ({ type: AT.CLICK_UPGRADE_WALLET_CONTINUE })

// Welcome Modal
export const clickWelcomeContinue = () => ({ type: AT.CLICK_WELCOME_CONTINUE })
