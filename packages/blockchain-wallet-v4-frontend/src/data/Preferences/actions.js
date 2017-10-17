import * as AT from './actionTypes'

export const setCulture = (payload) => ({ type: AT.SET_CULTURE, payload })

export const setLanguage = (payload) => ({ type: AT.SET_LANGUAGE, payload })

export const setTheme = (payload) => ({ type: AT.SET_THEME, payload })

export const toggleCoinDisplayed = () => ({ type: AT.TOGGLE_COIN_DISPLAY })
