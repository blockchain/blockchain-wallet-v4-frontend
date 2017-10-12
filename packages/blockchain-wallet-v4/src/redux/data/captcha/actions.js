import * as AT from './actionTypes'

export const setCaptcha = (url, sessionToken) => ({ type: AT.SET_CAPTCHA, payload: { url, sessionToken } })

export const deleteCaptcha = () => ({ type: AT.DELETE_CAPTCHA })
