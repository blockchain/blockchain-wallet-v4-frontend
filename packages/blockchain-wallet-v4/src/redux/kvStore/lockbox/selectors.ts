import { length, path, pathOr } from 'ramda'

import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

const getMetadata = path([kvStorePath, LOCKBOX])

export const hasDeprecatedDevice = (state) => {
  // @ts-ignore
  const devices = getMetadata(state).map(pathOr([], ['value', 'devices']))
  return (length(devices.getOrElse([])) > 0) as boolean
}
