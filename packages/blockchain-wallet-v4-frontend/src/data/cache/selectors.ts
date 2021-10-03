import { path } from 'ramda'

import { crypto as wCrypto } from 'blockchain-wallet-v4/src'

export const getLastAnnouncementState = (state): string | undefined =>
  path(['cache', 'announcements'], state)
export const getEmail = (state): string | undefined => path(['cache', 'lastEmail'], state)
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
