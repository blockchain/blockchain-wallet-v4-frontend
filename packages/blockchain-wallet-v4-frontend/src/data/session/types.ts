export type SessionStateType = { [key: string]: string }

export type SessionStatePOCType = {
  exchange?: AccountSessionType
  wallet?: AccountSessionType
}

export type AccountSessionType = {
  email?: string
  guid?: string
  id: string
}
