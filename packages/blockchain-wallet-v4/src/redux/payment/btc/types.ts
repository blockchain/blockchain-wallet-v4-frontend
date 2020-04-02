export type UTXOType = {
  address: string
  change: boolean
  index: number
  path: string
  script: string
  txHash: string
  value: number
  xpub: {
    m: string
    path: string
  }
}

export type IBtcFromType = {
  balance: number
  coin: 'BTC'
}

export type BtcLegacyFromType = IBtcFromType & {
  address: string
  label: string
  type: 'LEGACY'
  watchOnly: boolean
}

export type BtcFromType = BtcLegacyFromType
