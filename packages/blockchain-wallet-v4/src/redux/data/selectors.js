import { useWith, prop, map } from 'ramda'
import * as bitcoin from './bitcoin/selectors'
import * as ethereum from './ethereum/selectors'
import * as misc from './misc/selectors'

export const dataSelectorsFactory = ({ walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath }) => {
  const extend = path => s => useWith(s, [prop(path)])
  return ({
    bitcoin: map(extend(dataPath), bitcoin),
    ethereum: map(extend(dataPath), ethereum),
    misc: map(extend(dataPath), misc)
  })
}
