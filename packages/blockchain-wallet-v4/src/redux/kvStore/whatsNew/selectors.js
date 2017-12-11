import { path, prop, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { WHATSNEW } from '../config'

// export const getLastViewed = compose(prop('lastViewed'), KVStoreEntry.selectValue, prop(WHATSNEW))
export const getLastViewed = path([WHATSNEW, 'value', 'lastViewed'])
