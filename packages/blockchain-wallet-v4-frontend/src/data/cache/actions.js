import * as AT from './actionTypes'

export const announcementDismissed = id => ({
  type: AT.ANNOUNCEMENT_DISMISSED,
  payload: { id }
})
export const announcementToggled = (id, collapsed) => ({
  type: AT.ANNOUNCEMENT_TOGGLED,
  payload: { id, collapsed }
})
export const guidEntered = guid => ({
  type: AT.GUID_ENTERED,
  payload: { guid }
})
export const channelPrivKeyCreated = privKey => ({
  type: AT.CHANNEL_PRIV_KEY_CREATED,
  payload: { privKey }
})
export const channelRuidCreated = ruid => ({
  type: AT.CHANNEL_RUID_CREATED,
  payload: { ruid }
})
export const channelPhoneConnected = phonePubkey => ({
  type: AT.CHANNEL_PHONE_CONNECTED,
  payload: { phonePubkey }
})
