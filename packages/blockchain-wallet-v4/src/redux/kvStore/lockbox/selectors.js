import { keys, path, map, flatten } from 'ramda'
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

export const getLockboxBtcAccounts = state =>
  getLockboxBtc(state).map(btcs => map(btc => path(['accounts'], btc), btcs))

export const getLockboxBtcContext = state => {
  return getLockboxBtcAccounts(state).map(accounts => {
    return accounts ? flatten(accounts).map(a => path(['xpub'], a)) : []
  })
}
