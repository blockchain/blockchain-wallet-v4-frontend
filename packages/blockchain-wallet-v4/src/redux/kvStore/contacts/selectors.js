import { path } from 'ramda'
import { CONTACTS } from '../config'
import { kvStorePath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getMetadata = path([kvStorePath, CONTACTS])
