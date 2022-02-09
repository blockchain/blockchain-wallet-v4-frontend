import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  announcements: {},
  channelChannelId: undefined,
  channelPhonePubkey: undefined,
  channelPrivKey: undefined,
  exchangeEmail: undefined,
  guidStored: undefined,
  hasCloudBackup: undefined,
  lastEmail: undefined,
  lastGuid: undefined,
  lastLogoutTimestamp: undefined,
  mobileConnected: undefined
}

const cacheSlice = createSlice({
  initialState,
  name: 'cache',
  reducers: {
    announcementDismissed: (state, action) => {
      state.announcements[action.payload] = { dismissed: true }
    },
    announcementToggled: (state, action) => {
      const { collapsed, id } = action.payload

      state.announcements[id] = { ...state.announcements[id], collapsed }
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
    exchangeEmail: (state, action) => {
      state.exchangeEmail = action.payload
    },
    guidEntered: (state, action) => {
      state.lastGuid = action.payload
    },
    guidStored: (state, action) => {
      state.guidStored = action.payload
    },
    hasCloudBackup: (state, action) => {
      state.hasCloudBackup = action.payload
    },
    lastLogoutTimestamp: (state, action) => {
      state.lastLogoutTimestamp = action.payload
    },
    mobileConnectedStored: (state, action) => {
      state.mobileConnected = action.payload
    },
    removeExchangeLogin: (state) => {
      state.exchangeEmail = undefined
    },
    removeStoredLogin: (state) => {
      state.exchangeEmail = undefined
      state.guidStored = undefined
      state.lastEmail = undefined
      state.lastGuid = undefined
      state.mobileConnected = undefined
      state.hasCloudBackup = undefined
    },
    removeWalletLogin: (state) => {
      state.guidStored = undefined
      state.lastEmail = undefined
      state.lastGuid = undefined
      state.mobileConnected = undefined
      state.hasCloudBackup = undefined
    }
  }
})

export const { actions } = cacheSlice
export const cacheReducer = cacheSlice.reducer
