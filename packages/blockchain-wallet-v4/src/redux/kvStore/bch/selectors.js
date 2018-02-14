import { path } from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BCH])
