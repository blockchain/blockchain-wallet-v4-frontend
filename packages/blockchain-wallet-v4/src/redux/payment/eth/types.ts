export type EthFromType = 'ACCOUNT' | 'LOCKBOX' | 'CUSTODIAL'

export type EthAccountFromType = {
  address: string
  balance: string
  coin: 'ETH'
  label: string
  type: 'ACCOUNT' | 'LOCKBOX'
}

export type EthCustodialFromType = {
  available: string
  fiatAmount: null
  label: string
  pending: string
  type: 'CUSTODIAL'
}
