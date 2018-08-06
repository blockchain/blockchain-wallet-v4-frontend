import { keys, map, path } from 'ramda'
import { selectors } from 'data'

export const getDeviceNames = state => {
  const deviceList = selectors.core.kvStore.lockbox
    .getDevices(state)
    .getOrElse({})

  return map(d => path([d, 'deviceName'], deviceList), keys(deviceList))
}
