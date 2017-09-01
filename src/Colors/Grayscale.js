import { mapObjIndexed } from 'ramda'
import { grayscale } from 'polished'
import Default from './Default'

export default mapObjIndexed((num, key, obj) => grayscale(num), Default)
