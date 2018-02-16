import { path } from 'ramda'
// import { KVStoreEntry } from '../../../types'
import { ROOT } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadataXpriv = state =>
  path([kvStorePath, ROOT], state).map(path(['value', 'metadata'])).getOrElse(null)
