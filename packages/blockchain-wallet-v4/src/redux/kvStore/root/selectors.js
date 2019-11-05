import { kvStorePath } from '../../paths'
import { path } from 'ramda'
import { ROOT } from '../config'

export const getMetadataXpriv = state =>
  path([kvStorePath, ROOT], state)
    .map(path(['value', 'metadata']))
    .getOrElse(null)
