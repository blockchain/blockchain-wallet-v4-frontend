import { crypto as wCrypto } from '@core'
import { RootState } from 'data/rootReducer'

export const getLastAnnouncementState = (state: RootState) => state.cache.announcements
export const getCache = (state: RootState) => state.cache
export const getEmail = (state: RootState) => state.cache.lastEmail
export const getExchangeEmail = (state: RootState) => state.cache.exchangeEmail
export const getExchangeWalletGuid = (state: RootState) => state.cache.exchangeWalletGuid
export const getStoredGuid = (state: RootState) => state.cache.guidStored
export const getMobileConnected = (state: RootState) => state.cache.mobileConnected
export const getLastGuid = (state: RootState) => state.cache.lastGuid
export const getChannelChannelId = (state: RootState) => state.cache.channelChannelId
export const getChannelPrivKey = (state: RootState) => state.cache.channelPrivKey
export const getPhonePubkey = (state: RootState) => state.cache.channelPhonePubkey
export const getHasCloudBackup = (state: RootState) => state.cache.hasCloudBackup
export const getLastLogoutTimestamp = (state: RootState) => state.cache.lastLogoutTimestamp
export const getUnifiedAccountStatus = (state: RootState) => state.cache.unifiedAccount
export const getLastUnusedAmounts = (state: RootState) => state.cache.lastUnusedAmounts

export const getNoActionRequiredSweep = (state: RootState) => state.cache.noActionRequiredSweep

export const getChannelPrivKeyForQrData = (state: RootState) => {
  const channelPrivKey = getChannelPrivKey(state)

  if (!channelPrivKey) return ''

  return JSON.stringify({
    channelId: getChannelChannelId(state),
    pubkey: wCrypto.derivePubFromPriv(Buffer.from(channelPrivKey, 'hex')).toString('hex'),
    type: 'login_wallet'
  })
}
