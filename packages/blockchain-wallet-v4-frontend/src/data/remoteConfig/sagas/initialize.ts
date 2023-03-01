import { call, put } from 'typed-redux-saga'

import { getApi } from 'data/utils/sagas/getApi'

import { DEFAULT_CONFIG } from '../constants'
import { actions } from '../slice'
import { RemoteConfigFromApiValue, RemoteConfigKey } from '../types'

/**
 * Removes all keys that are not in `DEFAULT_CONFIG`.
 * If key is not in `configFromApi` but in `DEFAULT_CONFIG` then keeps the key and uses default value.
 */
const parseConfigFromApi = (configFromApi: Record<string, RemoteConfigFromApiValue>) =>
  Object.values(RemoteConfigKey).reduce((parsedConfig, key) => {
    const configValue = configFromApi[key]

    if (configValue) {
      return {
        ...parsedConfig,
        [key]: configValue.asBoolean()
      }
    }

    return parsedConfig
  }, DEFAULT_CONFIG)

export const initialize = function* () {
  const api = yield* call(getApi)

  try {
    // Attempt to activate config fetched in previous session
    yield* call(api.activateRemoteConfig)

    // Get config, merge it with default config and store it
    const config = yield* call(api.getRemoteConfig)
    const parsedConfig = parseConfigFromApi(config)
    yield* put(actions.setConfig(parsedConfig))

    // Fetch config for next session
    yield* call(api.fetchAndCacheRemoteConfig)
  } catch (e) {
    yield* put(actions.initializeFailed())
  }
}
