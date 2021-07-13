import { path } from 'ramda'

import { kvStorePath } from '../../paths'
import { ROOT } from '../config'

export const getMetadataXpriv = state =>
  path([kvStorePath, ROOT], state)
    .map(path(['value', 'metadata']))
    .getOrElse(null)
