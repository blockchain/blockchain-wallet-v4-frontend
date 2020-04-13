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
  watchOnly: boolean
}

export type BtcAccountFromType = IBtcFromType & {
  coin: 'BTC'
  index: number
  label: string
  type: 'ACCOUNT' | 'LOCKBOX'
  xpub: string
}

export type BtcCustodialFromType = IBtcFromType & {
  available?: string
  fiatAmount: null
  label: string
  pending?: string
  type: 'CUSTODIAL'
}

export type BtcLegacyFromType = IBtcFromType & {
  address: string
  label: string
  type: 'LEGACY'
  watchOnly: boolean
}

export type BtcFromType =
  | BtcAccountFromType
  | BtcCustodialFromType
  | BtcLegacyFromType
