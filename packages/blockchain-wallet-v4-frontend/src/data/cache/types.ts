export type CacheType = {
  announcements: Announcement
  channelChannelId: string | undefined
  channelPhonePubkey: string | undefined
  channelPrivKey: string | undefined
  exchangeEmail: string | undefined
  exchangeWalletGuid: string | undefined
  guidStored: string | undefined
  hasCloudBackup: boolean | undefined
  lastEmail: string | undefined
  lastGuid: string | undefined
  lastLogoutTimestamp: number | undefined
  lastUnusedAmounts: UnusedAmmounts
  mobileConnected: boolean | undefined
  noActionRequiredSweep: ActionSweep | undefined
  unifiedAccount: boolean | undefined
}

type Announcement = { [keyof: string]: { collapsed?: boolean; dismissed: boolean } }

type UnusedAmmounts = { [keyof: string]: string }

type ActionSweep = { guid: string; seen: boolean }
