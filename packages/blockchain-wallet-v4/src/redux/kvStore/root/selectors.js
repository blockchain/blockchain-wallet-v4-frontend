import { prop, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { ROOT } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadataXpriv = compose(prop('metadata'), KVStoreEntry.selectValue, prop(ROOT), prop(kvStorePath))
