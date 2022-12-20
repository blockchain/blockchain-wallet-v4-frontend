export type SessionStateType = {
  exchange?: AccountSessionType
  recover?: AccountSessionType
  wallet?: AccountSessionType
}

export type AccountSessionType = {
  email?: string
  guid?: string
  id: string
}
