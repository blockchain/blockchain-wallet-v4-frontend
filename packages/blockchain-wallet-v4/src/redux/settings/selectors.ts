import { prop } from 'ramda'

import { RemoteDataType } from 'core/types'

import { settingsPath } from '../paths'
import { InvitationsType } from '.'

export const getSettings = prop(settingsPath) as any
export const getLanguage = (state) => getSettings(state).map(prop('language'))
export const getCountryCode = (state) => getSettings(state).map(prop('country_code'))
export const getCurrency = (state) => getSettings(state).map(prop('currency'))
export const getUsState = (state) => getSettings(state).map(prop('state'))
export const getSmsNumber = (state) => getSettings(state).map(prop('sms_number'))
export const getSmsVerified = (state) => getSettings(state).map(prop('sms_verified'))
export const getEmail = (state) => getSettings(state).map(prop('email'))
export const getEmailVerified = (state) => getSettings(state).map(prop('email_verified'))
export const getEmailVerifiedFailed = (state) =>
  getSettings(state).map(prop('email_verified_failed'))
export const getAutoLogout = (state) => getSettings(state).map(prop('auto_logout'))
export const getLoggingLevel = (state) => getSettings(state).map(prop('logging_level'))
export const getIpLock = (state) => getSettings(state).map(prop('ip_lock'))
export const getIpLockOn = (state) => getSettings(state).map(prop('ip_lock_on'))
export const getBlockTorIps = (state) => getSettings(state).map(prop('block_tor_ips'))
export const getHint = (state) => getSettings(state).map(prop('password_hint1'))
export const getAuthType = (state) => getSettings(state).map(prop('auth_type'))
export const getAuthTypeNeverSave = (state) => getSettings(state).map(prop('never_save_auth_type'))
export const getGoogleAuthSecretUrl = (state) =>
  getSettings(state).map(prop('google_authenticator_secret_url'))
export const getNotificationsOn = (state) => getSettings(state).map(prop('notifications_on'))
export const getNotificationsType = (state) => getSettings(state).map(prop('notifications_type'))
export const getInvitations = (state): RemoteDataType<string, InvitationsType> =>
  getSettings(state).map(prop('invited'))
export const getLastMnemonicBackup = (state) => getSettings(state).map(prop('last_mnemonic_backup'))
