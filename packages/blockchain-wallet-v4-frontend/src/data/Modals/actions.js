import * as AT from './actionTypes'

export const closeModal = () => ({ type: AT.CLOSE_MODAL })

export const closeAllModals = () => ({ type: AT.CLOSE_ALL_MODALS })

export const showModal = (type, props = {}) => ({ type: AT.SHOW_MODAL, payload: { type, props } })

export const replaceModal = (type, props = {}) => ({ type: AT.REPLACE_MODAL, payload: { type, props } })
