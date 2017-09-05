import { mapObjIndexed } from 'ramda'
import { invert } from 'polished'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => invert(num), Default)
