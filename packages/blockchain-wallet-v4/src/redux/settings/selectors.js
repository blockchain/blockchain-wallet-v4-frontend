import { path } from 'ramda'
import { settingsPath } from '../paths'

export const getSettings = path([settingsPath])

export const getBtcUnit = state => getSettings(state).map(path([settingsPath, 'btc_currency']))
export const getLanguage = state => getSettings(state).map(path([settingsPath, 'language']))
export const getCountryCode = state => getSettings(state).map(path([settingsPath, 'country_code']))
export const getCurrency = state => getSettings(state).map(path([settingsPath, 'currency']))
export const getSmsNumber = state => getSettings(state).map(path([settingsPath, 'sms_number']))
export const getSmsVerified = state => getSettings(state).map(path([settingsPath, 'sms_verified']))
export const getEmail = state => getSettings(state).map(path([settingsPath, 'email']))
export const getEmailVerified = state => getSettings(state).map(path([settingsPath, 'email_verified']))
export const getAutoLogout = state => getSettings(state).map(path([settingsPath, 'auto_logout']))
export const getLoggingLevel = state => getSettings(state).map(path([settingsPath, 'logging_level']))
export const getIpLock = state => getSettings(state).map(path([settingsPath, 'ip_lock']))
export const getIpLockOn = state => getSettings(state).map(path([settingsPath, 'ip_lock_on']))
export const getBlockTorIps = state => getSettings(state).map(path([settingsPath, 'block_tor_ips']))
export const getHint = state => getSettings(state).map(path([settingsPath, 'password_hint1']))
export const getAuthType = state => getSettings(state).map(path([settingsPath, 'auth_type']))
export const getAuthTypeNeverSave = state => getSettings(state).map(path([settingsPath, 'never_save_auth_type']))
