import { path } from 'ramda'
import { settingsPath } from '../paths'

export const getSettings = path([settingsPath])

export const getBtcUnit = path([settingsPath, 'settings', 'value', 'btc_currency'])
export const getLanguage = path([settingsPath, 'settings', 'value', 'language'])
export const getCountryCode = path([settingsPath, 'settings', 'value', 'country_code'])
export const getCurrency = path([settingsPath, 'settings', 'value', 'currency'])
export const getSmsNumber = path([settingsPath, 'settings', 'value', 'sms_number'])
export const getSmsVerified = path([settingsPath, 'settings', 'value', 'sms_verified'])
export const getEmail = path([settingsPath, 'settings', 'value', 'email'])
export const getEmailVerified = path([settingsPath, 'settings', 'value', 'email_verified'])
export const getAutoLogout = path([settingsPath, 'settings', 'value', 'auto_logout'])
export const getLoggingLevel = path([settingsPath, 'settings', 'value', 'logging_level'])
export const getIpLock = path([settingsPath, 'settings', 'value', 'ip_lock'])
export const getIpLockOn = path([settingsPath, 'settings', 'value', 'ip_lock_on'])
export const getBlockTorIps = path([settingsPath, 'settings', 'value', 'block_tor_ips'])
export const getHint = path([settingsPath, 'settings', 'value', 'password_hint1'])
export const getAuthType = path([settingsPath, 'settings', 'value', 'auth_type'])
export const getAuthTypeNeverSave = path([settingsPath, 'settings', 'value', 'never_save_auth_type'])
