import { grayscale } from 'polished'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => grayscale(num), Default)
