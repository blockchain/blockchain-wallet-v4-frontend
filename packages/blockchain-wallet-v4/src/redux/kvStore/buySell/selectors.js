import { path } from 'ramda'
import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BUYSELL])
