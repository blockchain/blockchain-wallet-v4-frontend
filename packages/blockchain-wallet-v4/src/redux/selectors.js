import { useWith, prop, map } from 'ramda'
import { dataSelectorsFactory } from './data/selectors.js'
import * as settings from './settings/selectors.js'
import * as wallet from './wallet/selectors.js'
import * as walletOptions from './walletOptions/selectors.js'
import { kvStoreSelectorsFactory } from './kvStore/selectors.js'
import { commonSelectorsFactory } from './common/selectors.js'

export const coreSelectorsFactory = ({walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath}) => {
  const common = commonSelectorsFactory({ walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath })
  const data = dataSelectorsFactory({ walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath })
  const kvStore = kvStoreSelectorsFactory({walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath})
  const extend = path => s => useWith(s, [prop(path)])

  return {
    common,
    data,
    kvStore,
    settings: map(extend(settingsPath), settings),
    wallet: map(extend(walletPath), wallet),
    walletOptions: map(extend(walletOptionsPath), walletOptions)
  }
}
