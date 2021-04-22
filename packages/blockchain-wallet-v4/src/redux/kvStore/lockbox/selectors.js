import {
  addIndex,
  any,
  filter,
  flatten,
  head,
  lensProp,
  map,
  nth,
  path,
  pathOr,
  prop,
  propEq,
  propOr,
  set
} from 'ramda'

import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

// General
export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = state =>
  getMetadata(state)
    .map(pathOr([], ['value', 'devices']))
    .map(devices => {
      const mapIndexed = addIndex(map)
      const deviceIndexLens = lensProp('device_index')
      const setDeviceIndex = (device, i) => set(deviceIndexLens, i, device)
      return mapIndexed(setDeviceIndex, devices)
    })

export const getDevice = (state, deviceIndex) =>
  getDevices(state).map(nth(deviceIndex))

export const getDeviceName = (state, deviceIndex) =>
  getDevice(state, deviceIndex).map(prop('device_name'))

export const getDeviceFromCoinAddrs = (state, coin, addrs) => {
  switch (coin) {
    case 'BTC':
      return getDeviceFromBtcXpubs(state, addrs)
    case 'BCH':
      return getDeviceFromBchXpubs(state, addrs)
    case 'ETH':
      return getDeviceFromEthAddr(state, head(addrs))
    case 'XLM':
      return getDeviceFromXlmAddr(state, head(addrs))
  }
}

// BTC
export const getLockboxBtc = state => getDevices(state).map(map(path(['btc'])))

export const getLockboxBtcAccounts = state =>
  getLockboxBtc(state)
    .map(map(path(['accounts'])))
    .map(flatten)

export const getLockboxBtcContext = state => {
  return getLockboxBtcAccounts(state).map(accounts => {
    return accounts
      ? accounts.map(a =>
          path(['derivations'], a)
            .filter(propEq('type', 'legacy'))
            .map(prop('xpub'))
        )
      : []
  })
}
export const getBtcContextForDevice = (state, deviceIndex) =>
  getDevice(state, deviceIndex)
    .map(path(['btc', 'accounts']))
    .map(
      map(a =>
        path(['derivations'], a)
          .filter(propEq('type', 'legacy'))
          .map(prop('xpub'))
      )
    )

export const getLockboxBtcAccount = (state, xpub) =>
  getLockboxBtcAccounts(state)
    .map(
      filter(x =>
        propEq('xpub', xpub, x.derivations.find(propEq('type', 'legacy')))
      )
    )
    .map(head)

export const getDeviceFromBtcXpubs = (state, xpubs) => {
  const accountContainsXpubs = account =>
    any(
      xpub =>
        propEq(
          'xpub',
          xpub,
          account.derivations.find(propEq('type', 'legacy'))
        ),
      xpubs
    )
  const deviceFilter = device =>
    any(accountContainsXpubs, path(['btc', 'accounts'], device))
  return getDevices(state)
    .map(filter(deviceFilter))
    .map(head)
}

// BCH
export const getLockboxBch = state => getDevices(state).map(map(path(['bch'])))

export const getLockboxBchAccounts = state =>
  getLockboxBch(state)
    .map(map(path(['accounts'])))
    .map(flatten)

export const getLockboxBchContext = state => {
  return getLockboxBchAccounts(state).map(accounts => {
    return accounts
      ? accounts.map(a =>
          path(['derivations'], a)
            .filter(propEq('type', 'bch-145'))
            .map(prop('xpub'))
        )
      : []
  })
}

export const getBchContextForDevice = (state, deviceIndex) =>
  getDevice(state, deviceIndex)
    .map(path(['bch', 'accounts']))
    .map(
      map(a =>
        path(['derivations'], a)
          .filter(propEq('type', 'bch-145'))
          .map(prop('xpub'))
      )
    )

export const getLockboxBchAccount = (state, xpub) =>
  getLockboxBchAccounts(state)
    .map(
      filter(x =>
        propEq('xpub', xpub, x.derivations.find(propEq('type', 'bch-145')))
      )
    )
    .map(head)

export const getDeviceFromBchXpubs = (state, xpubs) => {
  const accountContainsXpubs = account =>
    any(
      xpub =>
        propEq(
          'xpub',
          xpub,
          account.derivations.find(propEq('type', 'bch-145'))
        ),
      xpubs
    )
  const deviceFilter = device =>
    any(accountContainsXpubs, path(['bch', 'accounts'], device))
  return getDevices(state)
    .map(filter(deviceFilter))
    .map(head)
}

// ETH
export const getLockboxEth = state => getDevices(state).map(map(path(['eth'])))

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
export const getEthContextForDevice = (state, deviceIndex) =>
  getDevice(state, deviceIndex)
    .map(path(['eth', 'accounts']))
    .map(map(prop('addr')))

export const getDeviceFromEthAddr = (state, addr) => {
  const accountContainsAddr = account => account.addr === addr
  const deviceFilter = device =>
    any(accountContainsAddr, path(['eth', 'accounts'], device))
  return getDevices(state)
    .map(filter(deviceFilter))
    .map(head)
}

export const getLatestTxEth = (state, address) =>
  getDeviceFromEthAddr(state, address).map(path(['eth', 'last_tx']))

export const getLatestTxTimestampEth = (state, address) =>
  getDeviceFromEthAddr(state, address).map(path(['eth', 'last_tx_timestamp']))

// XLM
export const getLockboxXlm = state => getDevices(state).map(map(prop('xlm')))

export const getLockboxXlmAccounts = state =>
  getLockboxXlm(state)
    .map(map(propOr([], 'accounts')))
    .map(flatten)

export const getLockboxXlmAccount = (state, address) =>
  getLockboxXlmAccounts(state)
    .map(filter(x => x.publicKey === address))
    .map(head)

export const getLockboxXlmContext = state => {
  return getLockboxXlmAccounts(state).map(accounts => {
    return accounts ? accounts.map(prop('publicKey')) : []
  })
}
export const getXlmContextForDevice = (state, deviceIndex) =>
  getDevice(state, deviceIndex)
    .map(pathOr([], ['xlm', 'accounts']))
    .map(map(prop('publicKey')))

export const getDeviceFromXlmAddr = (state, publicKey) => {
  const accountContainsAddr = account => account.publicKey === publicKey
  const deviceFilter = device =>
    any(accountContainsAddr, path(['xlm', 'accounts'], device))
  return getDevices(state)
    .map(filter(deviceFilter))
    .map(head)
}
