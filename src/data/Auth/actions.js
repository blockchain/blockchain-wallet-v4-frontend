export const LOGIN_START = 'LOGIN_START'
export const loginStart = (credentials) => ({ type: LOGIN_START, payload: credentials })

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const loginSuccess = () => ({ type: LOGIN_SUCCESS })

export const LOGIN_ERROR = 'LOGIN_ERROR'
export const loginError = (payload) => ({ type: LOGIN_ERROR, payload, error: true })

export const SAVE_SESSION = 'SAVE_SESSION'
export const saveSession = (payload) => ({ type: SAVE_SESSION, payload })

export const AUTOLOGOUT_START = 'AUTOLOGOUT_START'
export const autoLogoutStart = () => ({ type: AUTOLOGOUT_START })

export const LOGOUT_START = 'LOGOUT_START'
export const logoutStart = () => ({ type: LOGOUT_START })

export const LOGOUT_CANCEL = 'LOGOUT_CANCEL'
export const logoutCancel = () => ({ type: LOGOUT_CANCEL })
