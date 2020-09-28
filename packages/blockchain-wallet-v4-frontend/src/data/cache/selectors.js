import { path } from 'ramda'

export const getLastAnnouncementState = state =>
  path(['cache', 'announcements'], state)
export const getLastGuid = state => path(['cache', 'lastGuid'], state)
export const getChannelPrivKey = state =>
  path(['cache', 'channelPrivKey'], state)
export const getChannelChannelId = state =>
  path(['cache', 'channelChannelId'], state)
export const getPhonePubkey = state =>
  path(['cache', 'channelPhonePubkey'], state)
