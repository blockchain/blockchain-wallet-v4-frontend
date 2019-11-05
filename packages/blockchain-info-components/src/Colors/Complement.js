import { complement } from 'polished'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => complement(num), Default)
