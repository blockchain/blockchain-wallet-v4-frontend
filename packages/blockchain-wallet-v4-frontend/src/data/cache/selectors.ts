import { path } from 'ramda'

import { crypto as wCrypto } from '@core'
import { RootState } from 'data/rootReducer'

export const getLastAnnouncementState = (state): object | undefined =>
  path(['cache', 'announcements'], state)
export const getCache = (state: RootState) => state.cache
export const getEmail = (state): string | undefined => path(['cache', 'lastEmail'], state)
export const getExchangeEmail = (state): string | undefined =>
  path(['cache', 'exchangeEmail'], state)
export const getExchangeWalletGuid = (state): string | undefined =>
  path(['cache', 'exchangeWalletGuid'], state)
export const getStoredGuid = (state): string | undefined => path(['cache', 'guidStored'], state)
export const getMobileConnected = (state): string | undefined =>
  path(['cache', 'mobileConnected'], state)
export const getLastGuid = (state): string | undefined => path(['cache', 'lastGuid'], state)
export const getChannelChannelId = (state): string | undefined =>
  path(['cache', 'channelChannelId'], state)
export const getChannelPrivKey = (state): string | undefined =>
  path(['cache', 'channelPrivKey'], state)
export const getPhonePubkey = (state): string | undefined =>
  path(['cache', 'channelPhonePubkey'], state)
export const getHasCloudBackup = (state): boolean | undefined =>
  path(['cache', 'hasCloudBackup'], state)
export const getLastLogoutTimestamp = (state): boolean | undefined =>
  path(['cache', 'lastLogoutTimestamp'], state)
export const getUnifiedAccountStatus = (state): boolean | undefined =>
  path(['cache', 'unifiedAccount'], state)
export const getLastUnusedAmounts = (state): boolean | undefined =>
  path(['cache', 'lastUnusedAmounts'], state)

export const getNoActionRequiredSweep = (state): { guid: string; seen: boolean } | undefined =>
  path(['cache', 'noActionRequiredSweep'], state)

export const getChannelPrivKeyForQrData = (state) => {
  const channelPrivKey = getChannelPrivKey(state)

  if (channelPrivKey) {
    return JSON.stringify({
      channelId: getChannelChannelId(state),
      pubkey: wCrypto.derivePubFromPriv(Buffer.from(channelPrivKey, 'hex')).toString('hex'),
      type: 'login_wallet'
    })
  }
  return ''
}
