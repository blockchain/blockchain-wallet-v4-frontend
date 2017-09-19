import * as AT from './actionTypes'

// Generic
export const closeModal = () => ({ type: AT.CLOSE_MODAL })
export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })
export const showModal = (type, props = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props } })

// AutoDisconnection
export const clickAutoDisconnectionLogout = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_LOGOUT })
export const clickAutoDisconnectionCancel = () => ({ type: AT.CLICK_AUTO_DISCONNECTION_CANCEL })

// TwoStepSetup
export const clickTwoStepSetupDisable = () => ({ type: AT.CLICK_TWO_STEP_SETUP_DISABLE })
export const clickTwoStepSetupMobile = () => ({ type: AT.CLICK_TWO_STEP_SETUP_MOBILE })
export const clickTwoStepSetupGoogleAuthenticator = () => ({ type: AT.CLICK_TWO_STEP_SETUP_GOOGLE_AUTHENTICATOR })
export const clickTwoStepSetupYubico = () => ({ type: AT.CLICK_TWO_STEP_SETUP_YUBICO })

// TwoStepGoogleAuthenticator
export const clickTwoStepGoogleAuthenticatorEnable = () => ({ type: AT.CLICK_TWO_STEP_GOOGLE_AUTHENTICATOR_ENABLE })

// TwoStepYubico Modal
export const clickTwoStepYubicoEnable = () => ({ type: AT.CLICK_TWO_STEP_YUBICO_ENABLE })
