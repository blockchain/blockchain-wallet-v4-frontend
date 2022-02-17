export type SessionStateType = { [key: string]: string }

export type SessionStatePOCType = {
  wallet: Array<WalletSessionType>
  exchange: Array<ExchangeSessionType>
}

export type WalletSessionType = {
  email?: string
  guid?: string
  id: string
}

export type ExchangeSessionType = {
  email: string
  guid?: string
  id: string
}
