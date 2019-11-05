import { invert } from 'polished'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => invert(num), Default)
