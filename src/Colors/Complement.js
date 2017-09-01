import { mapObjIndexed } from 'ramda'
import { complement } from 'polished'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => complement(num), Default)
