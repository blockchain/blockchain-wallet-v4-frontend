import { useWith, prop, map } from 'ramda'
import * as whatsNew from './whatsNew/selectors.js'
import * as ethereum from './ethereum/selectors.js'
import * as shapeShift from './shapeShift/selectors.js'
import * as buySell from './buySell/selectors.js'
import * as contacts from './contacts/selectors.js'
import * as root from './root/selectors.js'

export const kvStoreSelectorsFactory = ({ kvStorePath }) => {
  const extend = path => s => useWith(s, [prop(path)])
  return ({
    root: map(extend(kvStorePath), root),
    whatsNew: map(extend(kvStorePath), whatsNew),
    ethereum: map(extend(kvStorePath), ethereum),
    shapeShift: map(extend(kvStorePath), shapeShift),
    buySell: map(extend(kvStorePath), buySell),
    contacts: map(extend(kvStorePath), contacts)
  })
}
