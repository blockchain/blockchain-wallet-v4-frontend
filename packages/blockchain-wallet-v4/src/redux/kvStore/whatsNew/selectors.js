import { prop, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { WHATSNEW } from '../config'
import { kvStorePath } from '../../paths'

export const getLastViewed = compose(prop('lastViewed'), KVStoreEntry.selectValue, prop(WHATSNEW), prop(kvStorePath))
