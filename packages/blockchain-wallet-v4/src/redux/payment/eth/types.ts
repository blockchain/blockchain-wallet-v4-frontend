import { CustodialFromType } from 'core/types'

export type EthAccountFromType = {
  address: string
  balance: string
  coin: 'ETH'
  label: string
  type: 'ACCOUNT'
}

export type EthAddressFromType = {
  address: string
  type: 'ADDRESS'
}

export type EthFromType = EthAccountFromType | CustodialFromType
