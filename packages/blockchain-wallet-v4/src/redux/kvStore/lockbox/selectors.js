import { addIndex, lensProp, map, path, pathOr, set } from 'ramda'

import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = (state) =>
  getMetadata(state)
    .map(pathOr([], ['value', 'devices']))
    .map((devices) => {
      const mapIndexed = addIndex(map)
      const deviceIndexLens = lensProp('device_index')
      const setDeviceIndex = (device, i) => set(deviceIndexLens, i, device)
      return mapIndexed(setDeviceIndex, devices)
    })
