import * as AT from './actionTypes'

export const setCulture = (payload) => ({ type: AT.SET_CULTURE, payload })

export const setLanguage = (payload) => ({ type: AT.SET_LANGUAGE, payload })

export const setTheme = (payload) => ({ type: AT.SET_THEME, payload })

export const setEmail = (payload) => ({ type: AT.SET_EMAIL, payload })

export const toggleChangingEmail = (payload) => ({ type: AT.CHANGING_EMAIL, payload })
