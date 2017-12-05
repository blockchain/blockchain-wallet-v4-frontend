import * as AT from './actionTypes'

export const setCulture = (culture) => ({ type: AT.SET_CULTURE, payload: { culture } })

export const setLanguage = (language) => ({ type: AT.SET_LANGUAGE, payload: { language } })

export const setTheme = (theme) => ({ type: AT.SET_THEME, payload: { theme } })

export const toggleCoinDisplayed = () => ({ type: AT.TOGGLE_COIN_DISPLAY })

export const setEtherWelcome = (displayed) => ({ type: AT.SET_ETHER_WELCOME, payload: { displayed } })
