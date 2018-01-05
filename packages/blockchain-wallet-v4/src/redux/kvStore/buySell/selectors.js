import { path } from 'ramda'
import { BUYSELL } from '../config'
import { kvStorePath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getMetadata = path([kvStorePath, BUYSELL])
