import { path } from 'ramda'
import { settingsPath } from '../paths'

export const getSettings = path([settingsPath])

export const getBtcUnit = state => getSettings(state).map(path(['btc_currency']))
export const getLanguage = state => getSettings(state).map(path(['language']))
export const getCountryCode = state => getSettings(state).map(path(['country_code']))
export const getCurrency = state => getSettings(state).map(path(['currency']))
export const getSmsNumber = state => getSettings(state).map(path(['sms_number']))
export const getSmsVerified = state => getSettings(state).map(path(['sms_verified']))
export const getEmail = state => getSettings(state).map(path(['email']))
export const getEmailVerified = state => getSettings(state).map(path(['email_verified']))
export const getAutoLogout = state => getSettings(state).map(path(['auto_logout']))
export const getLoggingLevel = state => getSettings(state).map(path(['logging_level']))
export const getIpLock = state => getSettings(state).map(path(['ip_lock']))
export const getIpLockOn = state => getSettings(state).map(path(['ip_lock_on']))
export const getBlockTorIps = state => getSettings(state).map(path(['block_tor_ips']))
export const getHint = state => getSettings(state).map(path(['password_hint1']))
export const getAuthType = state => getSettings(state).map(path(['auth_type']))
export const getAuthTypeNeverSave = state => getSettings(state).map(path(['never_save_auth_type']))
