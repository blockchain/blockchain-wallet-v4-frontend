import { path } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])
