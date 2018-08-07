import { keys, path, prop, map, flatten } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = state =>
  getMetadata(state).map(path(['value', 'devices']))

export const getDevice = (state, deviceID) => {
  return getDevices(state).map(prop(deviceID))
}

export const getAccounts = state =>
  getDevices(state).map(devices =>
    map(d => path([d, 'accounts'], devices), keys(devices))
  )

export const getLockboxBtc = state => getAccounts(state).map(map(path(['btc'])))

export const getLockboxBtcAccounts = state =>
  getLockboxBtc(state).map(map(path(['accounts'])))

export const getLockboxBtcContext = state => {
  return getLockboxBtcAccounts(state).map(accounts => {
    return accounts ? flatten(accounts).map(a => path(['xpub'], a)) : []
  })
}

export const getLockboxEth = state => getAccounts(state).map(map(path(['eth'])))

export const getLockboxEthAccounts = state =>
  getLockboxEth(state).map(map(path(['accounts'])))

export const getLockboxEthContext = state => {
  return getLockboxEthAccounts(state).map(accounts => {
    return accounts ? flatten(accounts).map(a => path(['addr'], a)) : []
  })
}
