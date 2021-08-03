import { CustodialFromType } from 'core/types'

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

export type BtcAccountFromType = IBtcFromType & {
  coin: 'BTC'
  index: number
  label: string
  type: 'ACCOUNT'
  xpub: string
}

export type BtcLegacyFromType = IBtcFromType & {
  address: string
  label: string
  type: 'LEGACY'
}

export type BtcFromType = BtcAccountFromType | BtcLegacyFromType | CustodialFromType
