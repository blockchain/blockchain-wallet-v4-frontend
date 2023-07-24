import { RemoteConfig, RemoteConfigKey } from 'data/remoteConfig/types'
import { RootState } from 'data/rootReducer'

export const getConfigValue = <T extends RemoteConfigKey>(
  state: RootState,
  configKey: T
): RemoteConfig[T] => state.remoteConfig[configKey]

export const selectors = {
  getConfigValue
}
