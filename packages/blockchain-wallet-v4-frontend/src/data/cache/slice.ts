import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CacheType } from './types'

const initialState: CacheType = {
  announcements: {},
  channelChannelId: undefined,
  channelPhonePubkey: undefined,
  channelPrivKey: undefined,
  exchangeEmail: undefined,
  exchangeWalletGuid: undefined,
  guidStored: undefined,
  hasCloudBackup: undefined,
  lastEmail: undefined,
  lastGuid: undefined,
  lastLogoutTimestamp: undefined,
  lastUnusedAmounts: {},
  mobileConnected: undefined,
  noActionRequiredSweep: undefined,
  unifiedAccount: false
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
    channelChannelIdCreated: (state, action: PayloadAction<CacheType['channelChannelId']>) => {
      state.channelChannelId = action.payload
    },
    channelPhoneConnected: (state, action: PayloadAction<CacheType['channelPhonePubkey']>) => {
      state.channelPhonePubkey = action.payload
    },
    channelPrivKeyCreated: (state, action: PayloadAction<CacheType['channelPrivKey']>) => {
      state.channelPrivKey = action.payload
    },
    disconnectChannelPhone: (state) => {
      state.channelPhonePubkey = undefined
    },
    emailStored: (state, action: PayloadAction<CacheType['lastEmail']>) => {
      state.lastEmail = action.payload
    },
    exchangeEmail: (state, action: PayloadAction<CacheType['exchangeEmail']>) => {
      state.exchangeEmail = action.payload
    },
    exchangeWalletGuid: (state, action: PayloadAction<CacheType['exchangeWalletGuid']>) => {
      state.exchangeWalletGuid = action.payload
    },
    guidEntered: (state, action: PayloadAction<CacheType['lastGuid']>) => {
      state.lastGuid = action.payload
    },
    guidStored: (state, action: PayloadAction<CacheType['guidStored']>) => {
      state.guidStored = action.payload
    },
    hasCloudBackup: (state, action: PayloadAction<CacheType['hasCloudBackup']>) => {
      state.hasCloudBackup = action.payload
    },
    lastLogoutTimestamp: (state, action: PayloadAction<CacheType['lastLogoutTimestamp']>) => {
      state.lastLogoutTimestamp = action.payload
    },
    mobileConnectedStored: (state, action: PayloadAction<CacheType['mobileConnected']>) => {
      state.mobileConnected = action.payload
    },
    noActionRequiredSweep: (state, action: PayloadAction<CacheType['noActionRequiredSweep']>) => {
      state.noActionRequiredSweep = action.payload
    },
    removeExchangeLogin: (state) => {
      state.exchangeEmail = undefined
      state.exchangeWalletGuid = undefined
      state.unifiedAccount = undefined
    },
    removeLastUsedAmount: (state, action: PayloadAction<{ pair: string }>) => {
      if (state.lastUnusedAmounts[action.payload.pair]) {
        delete state.lastUnusedAmounts[action.payload.pair]
      }
    },
    removeNoActionRequiredSweep: (state) => {
      state.noActionRequiredSweep = undefined
    },
    removeStoredLogin: (state) => {
      state.exchangeEmail = undefined
      state.exchangeWalletGuid = undefined
      state.guidStored = undefined
      state.lastEmail = undefined
      state.lastGuid = undefined
      state.mobileConnected = undefined
      state.hasCloudBackup = undefined
      state.unifiedAccount = undefined
    },
    removeWalletLogin: (state) => {
      state.guidStored = undefined
      state.lastEmail = undefined
      state.lastGuid = undefined
      state.mobileConnected = undefined
      state.hasCloudBackup = undefined
      state.unifiedAccount = undefined
    },
    setLastUnusedAmount: (state, action: PayloadAction<{ amount: string; pair: string }>) => {
      state.lastUnusedAmounts[action.payload.pair] = action.payload.amount
    },
    setUnifiedAccount: (state, action: PayloadAction<CacheType['unifiedAccount']>) => {
      state.unifiedAccount = action.payload
    }
  }
})

export const { actions } = cacheSlice
export const cacheReducer = cacheSlice.reducer
