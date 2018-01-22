import { path } from 'ramda'
import { CONTACTS } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, CONTACTS])
