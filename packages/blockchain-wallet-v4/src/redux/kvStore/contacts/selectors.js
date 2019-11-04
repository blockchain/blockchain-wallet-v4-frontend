import { CONTACTS } from '../config'
import { kvStorePath } from '../../paths'
import { path } from 'ramda'

export const getMetadata = path([kvStorePath, CONTACTS])
