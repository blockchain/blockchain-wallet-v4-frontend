import { useWith, prop, map } from 'ramda'
import * as whatsNew from './whatsNew/selectors.js'
import * as ethereum from './ethereum/selectors.js'

export const kvStoreSelectorsFactory = ({walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath}) => {
  const extend = path => s => useWith(s, [prop(path)])
  return ({
    whatsNew: map(extend(kvStorePath), whatsNew),
    ethereum: map(extend(kvStorePath), ethereum)
  })
}
