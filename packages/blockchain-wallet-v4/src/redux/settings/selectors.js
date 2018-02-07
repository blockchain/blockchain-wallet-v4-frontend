import { prop } from 'ramda'
import { settingsPath } from '../paths'

export const getSettings = prop(settingsPath)

export const getBtcUnit = state => getSettings(state).map(prop('btc_currency'))
export const getLanguage = state => getSettings(state).map(prop('language'))
export const getCountryCode = state => getSettings(state).map(prop('country_code'))
export const getCurrency = state => getSettings(state).map(prop('currency'))
export const getSmsNumber = state => getSettings(state).map(prop('sms_number'))
export const getSmsVerified = state => getSettings(state).map(prop('sms_verified'))
export const getEmail = state => getSettings(state).map(prop('email'))
export const getEmailVerified = state => getSettings(state).map(prop('email_verified'))
export const getEmailVerifiedFailed = state => getSettings(state).map(prop('email_verified_failed'))
export const getAutoLogout = state => getSettings(state).map(prop('auto_logout'))
export const getLoggingLevel = state => getSettings(state).map(prop('logging_level'))
export const getIpLock = state => getSettings(state).map(prop('ip_lock'))
export const getIpLockOn = state => getSettings(state).map(prop('ip_lock_on'))
export const getBlockTorIps = state => getSettings(state).map(prop('block_tor_ips'))
export const getHint = state => getSettings(state).map(prop('password_hint1'))
export const getAuthType = state => getSettings(state).map(prop('auth_type'))
export const getAuthTypeNeverSave = state => getSettings(state).map(prop('never_save_auth_type'))
export const getGoogleAuthSecretUrl = state => getSettings(state).map(prop('google_authenticator_secret_url'))
