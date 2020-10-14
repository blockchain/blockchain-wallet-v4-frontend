import { curry, find, findIndex, map, nth, path, prop, propEq } from 'ramda'
import { kvStorePath } from '../../paths'
import { WALLET_CREDENTIALS } from '../config'

export const getMetadata = path([kvStorePath, WALLET_CREDENTIALS])
