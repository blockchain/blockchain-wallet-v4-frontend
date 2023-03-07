export enum RemoteConfigKey {
  WebFfSuperApp = 'web_ff_super_app'
}

export type RemoteConfig = {
  [key in RemoteConfigKey]: boolean
}

export type RemoteConfigFromApiValue = {
  asBoolean: () => boolean
  asNumber: () => number
  asString: () => string
}
