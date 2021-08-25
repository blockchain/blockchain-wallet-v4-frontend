import { assoc, assocPath } from 'ramda'

import * as AT from './actionTypes'

const INITIAL_STATE = {}

const cache = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.ANNOUNCEMENT_DISMISSED: {
      const { id } = payload
      return assocPath(['announcements', id, 'dismissed'], true, state)
    }
    case AT.ANNOUNCEMENT_TOGGLED: {
      const { collapsed, id } = payload
      return assocPath(['announcements', id, 'collapsed'], collapsed, state)
    }
    case AT.EMAIL_STORED: {
      const { email } = payload
      return assoc('lastEmail', email, state)
    }
    case AT.GUID_STORED: {
      const { guid } = payload
      return assoc('guidStored', guid, state)
    }
    case AT.MOBILE_CONNECTED_STORED: {
      const { mobileConnected } = payload
      return assoc('mobileConnected', mobileConnected, state)
    }

    case AT.REMOVED_STORED_LOGIN: {
      return {
        ...state,
        guidStored: undefined,
        lastEmail: undefined,
        mobileConnected: undefined
      }
    }
    case AT.GUID_ENTERED: {
      const { guid } = payload
      return assoc('lastGuid', guid, state)
    }
    case AT.CHANNEL_PRIV_KEY_CREATED: {
      const { privKey } = payload
      return assoc('channelPrivKey', privKey, state)
    }
    case AT.CHANNEL_CHANNEL_ID_CREATED: {
      const { channelId } = payload
      return assoc('channelChannelId', channelId, state)
    }
    case AT.CHANNEL_PHONE_CONNECTED: {
      const { phonePubkey } = payload
      return assoc('channelPhonePubkey', phonePubkey, state)
    }
    case AT.DISCONNECT_CHANNEL_PHONE: {
      return assoc('channelPhonePubkey', undefined, state)
    }
    default:
      return state
  }
}

export default cache
