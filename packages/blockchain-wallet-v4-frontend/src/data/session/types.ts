export type SessionStateType = { [key: string]: string }

export type SessionStatePOCType = {
  exchange?: ExchangeSessionType
  wallet?: WalletSessionType
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
