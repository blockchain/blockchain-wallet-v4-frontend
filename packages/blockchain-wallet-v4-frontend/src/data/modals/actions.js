import * as AT from './actionTypes'

// Remove the last modal added in the stack
export const closeModal = () => ({ type: AT.CLOSE_MODAL })
// Remove all the modals in the stack
export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })
// Add a modal in the stack
export const showModal = (type, props = {}, options = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props, options } })
// Replace the last modal added in the stack by this new one
export const replaceModal = (type, props = {}, options = {}) => ({ type: AT.REPLACE_MODAL, payload: { type, props, options } })
// Update the last modal added in the stack
export const updateModalOptions = (options = {}) => ({ type: AT.UPDATE_MODAL, payload: { options } })
