import * as AT from './actionTypes'

export const fetchCaptcha = () => ({ type: AT.FETCH_CAPTCHA })

export const fetchCaptchaSuccess = (data) => ({ type: AT.FETCH_CAPTCHA_SUCCESS, payload: data })

export const fetchCaptchaError = (message) => ({ type: AT.FETCH_CAPTCHA_ERROR, payload: message })

export const clearCaptcha = () => ({ type: AT.CLEAR_CAPTCHA })
