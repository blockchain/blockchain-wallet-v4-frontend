import { path } from 'ramda'

export const getLastAnnouncementState = state =>
  path(['cache', 'announcements'], state)
export const getEmail = state => path(['cache', 'lastEmail'], state)
export const getStoredGuid = state => path(['cache', 'guidStored'], state)
export const getMobileConnected = state =>
  path(['cache', 'mobileConnected'], state)
export const getLastGuid = state => path(['cache', 'lastGuid'], state)
export const getChannelPrivKey = state =>
  path(['cache', 'channelPrivKey'], state)
export const getChannelChannelId = state =>
  path(['cache', 'channelChannelId'], state)
export const getPhonePubkey = state =>
  path(['cache', 'channelPhonePubkey'], state)
