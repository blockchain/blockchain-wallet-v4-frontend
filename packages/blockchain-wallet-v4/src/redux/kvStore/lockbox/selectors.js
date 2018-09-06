import { any, curry, keys, path, prop, map, flatten, filter, head } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

// General
export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = state =>
  getMetadata(state).map(path(['value', 'devices']))

export const getDevice = (state, deviceID) =>
  getDevices(state).map(prop(deviceID))

export const getAccounts = state =>
  getDevices(state).map(devices =>
    map(d => path([d, 'accounts'], devices), keys(devices))
  )
export const getDeviceName = (state, deviceId) =>
  getDevice(state, deviceId).map(prop('name'))

// BTC
export const getLockboxBtc = state => getAccounts(state).map(map(path(['btc'])))

export const getLockboxBtcAccounts = state =>
  getLockboxBtc(state)
    .map(map(path(['accounts'])))
    .map(flatten)

export const getLockboxBtcContext = state => {
  return getLockboxBtcAccounts(state).map(accounts => {
    return accounts ? accounts.map(a => path(['xpub'], a)) : []
  })
}

export const getLockboxBtcAccount = (state, xpub) =>
  getLockboxBtcAccounts(state)
    .map(filter(x => x.xpub === xpub))
    .map(head)

export const getDeviceIdFromBtcXpubs = (state, xpubs) => {
  const accountContainsXpubs = account =>
    any(xpub => xpub === account.xpub, xpubs)
  const deviceFilter = curry((devices, device) =>
    any(
      accountContainsXpubs,
      path([device, 'accounts', 'btc', 'accounts'])(devices)
    )
  )
  return getDevices(state).map(devices =>
    filter(deviceFilter(devices), keys(devices))
  )
}

// BCH
export const getLockboxBch = state => getAccounts(state).map(map(path(['bch'])))

export const getLockboxBchAccounts = state =>
  getLockboxBch(state)
    .map(map(path(['accounts'])))
    .map(flatten)

export const getLockboxBchContext = state => {
  return getLockboxBchAccounts(state).map(accounts => {
    return accounts ? accounts.map(a => path(['xpub'], a)) : []
  })
}

export const getLockboxBchAccount = (state, xpub) =>
  getLockboxBchAccounts(state)
    .map(filter(x => x.xpub === xpub))
    .map(head)

export const getDeviceIdFromBchXpubs = (state, xpubs) => {
  const accountContainsXpubs = account =>
    any(xpub => xpub === account.xpub, xpubs)
  const deviceFilter = curry((devices, device) =>
    any(
      accountContainsXpubs,
      path([device, 'accounts', 'bch', 'accounts'])(devices)
    )
  )
  return getDevices(state).map(devices =>
    filter(deviceFilter(devices), keys(devices))
  )
}

// ETH
export const getLockboxEth = state => getAccounts(state).map(map(path(['eth'])))

export const getLockboxEthAccounts = state =>
  getLockboxEth(state)
    .map(map(path(['accounts'])))
    .map(flatten)

export const getLockboxEthAccount = (state, address) =>
  getLockboxEthAccounts(state)
    .map(filter(x => x.addr === address))
    .map(head)

export const getLockboxEthContext = state => {
  return getLockboxEthAccounts(state).map(accounts => {
    return accounts ? accounts.map(a => path(['addr'], a)) : []
  })
}

export const getDeviceIdFromEthAddr = (state, addr) => {
  const accountContainsAddr = account => account.addr === addr
  const deviceFilter = curry((devices, device) =>
    any(
      accountContainsAddr,
      path([device, 'accounts', 'eth', 'accounts'])(devices)
    )
  )
  return getDevices(state).map(devices =>
    filter(deviceFilter(devices), keys(devices))
  )
}
