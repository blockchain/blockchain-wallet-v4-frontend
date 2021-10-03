import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  announcements: {},
  channelChannelId: undefined,
  channelPhonePubkey: undefined,
  channelPrivKey: undefined,
  guidStored: undefined,
  lastEmail: undefined,
  lastGuid: undefined,
  mobileConnected: undefined
}

const cacheSlice = createSlice({
  initialState,
  name: 'cache',
  reducers: {
    announcementDismissed: (state, action) => {
      state.announcements[action.payload].dismissed = true
    },
    announcementToggled: (state, action) => {
      const { collapsed, id } = action.payload

      state.announcements[id].collapsed = collapsed
    },
    channelChannelIdCreated: (state, action) => {
      state.channelChannelId = action.payload
    },
    channelPhoneConnected: (state, action) => {
      state.channelPhonePubkey = action.payload
    },
    channelPrivKeyCreated: (state, action) => {
      state.channelPrivKey = action.payload
    },
    disconnectChannelPhone: (state) => {
      state.channelPhonePubkey = undefined
    },
    emailStored: (state, action) => {
      state.lastEmail = action.payload
    },
    guidEntered: (state, action) => {
      state.lastGuid = action.payload
    },
    guidStored: (state, action) => {
      state.guidStored = action.payload
    },
    mobileConnectedStored: (state, action) => {
      state.mobileConnected = action.payload
    },
    removedStoredLogin: (state) => {
      state.guidStored = undefined
      state.lastEmail = undefined
      state.lastGuid = undefined
      state.mobileConnected = undefined
    }
  }
})

export const { actions } = cacheSlice
export const cacheReducer = cacheSlice.reducer
