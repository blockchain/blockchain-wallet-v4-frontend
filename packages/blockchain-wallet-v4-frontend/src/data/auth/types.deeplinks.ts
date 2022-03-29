export type AppDeeplinkPayload = {
  params?: AppDeeplinkParams
  route: AppDeeplinkRoute
}

export type AppDeeplinkRoute = string

export type AppDeeplinkParams = KycDeeplinkParams | LogLevelDeeplinkParams | undefined

//
// DEEPLINK ROUTE SPECIFIC TYPES
//
export type LogLevelDeeplinkParams = {
  level: 'verbose'
}
export type KycDeeplinkParams = {
  tier?: 0 | 1 | 2 | 3
}
