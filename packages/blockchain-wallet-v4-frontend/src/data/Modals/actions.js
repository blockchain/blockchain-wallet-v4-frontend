import * as AT from './actionTypes'

// Generic
export const closeModal = () => ({ type: AT.CLOSE_MODAL })
export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })
export const showModal = (type, props = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props } })

// AutoDisconnection
export const clickAutoDisconnectionLogout = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_LOGOUT })
export const clickAutoDisconnectionCancel = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_CANCEL })

// MobileLogin
export const captureMobileLoginSuccess = (data) => ({ type: AT.CAPTURE_MOBILE_LOGIN_SUCCESS, payload: { data } })
export const captureMobileLoginError = (message) => ({ type: AT.CAPTURE_MOBILE_LOGIN_ERROR, payload: message })
export const clickMobileLoginCancel = () => ({ type: AT.CLICK_MOBILE_LOGIN_CANCEL })

// MobileNumberChange
export const clickMobileNumberChangeUpdate = () => ({ type: AT.CLICK_MOBILE_NUMBER_CHANGE_UPDATE })
export const clickMobileNumberChangeCancel = () => ({ type: AT.CLICK_MOBILE_NUMBER_CHANGE_CANCEL })

// MobileNumberVerify
export const clickMobileNumberVerifyValidate = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_VALIDATE })
export const clickMobileNumberVerifyResend = (mobileNumber) => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_RESEND, payload: { mobileNumber } })
export const clickMobileNumberVerifyChange = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_CHANGE })
export const clickMobileNumberVerifyCancel = () => ({ type: AT.CLICK_MOBILE_NUMBER_VERIFY_CANCEL })

// TwoStepSetup
export const clickTwoStepSetupDisable = () => ({ type: AT.CLICK_TWO_STEP_SETUP_DISABLE })
export const clickTwoStepSetupMobile = () => ({ type: AT.CLICK_TWO_STEP_SETUP_MOBILE })
export const clickTwoStepSetupGoogleAuthenticator = () => ({ type: AT.CLICK_TWO_STEP_SETUP_GOOGLE_AUTHENTICATOR })
export const clickTwoStepSetupYubico = () => ({ type: AT.CLICK_TWO_STEP_SETUP_YUBICO })

// TwoStepGoogleAuthenticator
export const clickTwoStepGoogleAuthenticatorEnable = () => ({ type: AT.CLICK_TWO_STEP_GOOGLE_AUTHENTICATOR_ENABLE })

// TwoStepYubico Modal
export const clickTwoStepYubicoEnable = () => ({ type: AT.CLICK_TWO_STEP_YUBICO_ENABLE })
