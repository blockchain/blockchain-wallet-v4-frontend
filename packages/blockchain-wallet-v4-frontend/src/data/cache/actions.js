import * as AT from './actionTypes'

export const announcementDismissed = id => ({
  type: AT.ANNOUNCEMENT_DISMISSED,
  payload: { id }
})
export const announcementToggled = (id, collapsed) => ({
  type: AT.ANNOUNCEMENT_TOGGLED,
  payload: { id, collapsed }
})

export const emailStored = email => ({
  type: AT.EMAIL_STORED,
  payload: { email }
})

export const guidStored = guid => ({
  type: AT.GUID_STORED,
  payload: { guid }
})
export const mobileConnectedStored = mobileConnected => ({
  type: AT.MOBILE_CONNECTED_STORED,
  payload: { mobileConnected }
})
export const guidEntered = guid => ({
  type: AT.GUID_ENTERED,
  payload: { guid }
})
export const removedStoredLogin = () => ({
  type: AT.REMOVED_STORED_LOGIN
})
export const channelPrivKeyCreated = privKey => ({
  type: AT.CHANNEL_PRIV_KEY_CREATED,
  payload: { privKey }
})
export const channelChannelIdCreated = channelId => ({
  type: AT.CHANNEL_CHANNEL_ID_CREATED,
  payload: { channelId }
})
export const channelPhoneConnected = phonePubkey => ({
  type: AT.CHANNEL_PHONE_CONNECTED,
  payload: { phonePubkey }
})
export const disconnectChannelPhone = () => ({
  type: AT.DISCONNECT_CHANNEL_PHONE
})
