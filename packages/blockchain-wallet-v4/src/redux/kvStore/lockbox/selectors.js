import { keys, path, map } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = state =>
  getMetadata(state).map(path(['value', 'devices']))

export const getDevice = (state, deviceID) =>
  getDevices(state).map(path(deviceID))

export const getLockboxBtc = state =>
  getDevices(state).map(devices =>
    map(d => path([d, 'btc'], devices), keys(devices))
  )

export const getLockboxBtcContext = state => {
  return getLockboxBtc(state).map(
    map(btc => map(a => path(['xpub'], a), path(['accounts'], btc)))
  )
}
