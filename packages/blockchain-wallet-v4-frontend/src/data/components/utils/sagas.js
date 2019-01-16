import { call, select } from 'redux-saga/effects'
import { equals, filter, identity, is, isEmpty, prop, propEq } from 'ramda'
import { utils } from 'blockchain-wallet-v4/src'
import EthUtil from 'ethereumjs-util'
import { selectors } from 'data'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const selectReceiveAddress = function*(source, networks) {
  const appState = yield select(identity)
  const coin = prop('coin', source)
  const type = prop('type', source)
  const address = prop('address', source)
  if (equals('XLM', coin) && is(String, address)) return address
  if (equals('ETH', coin) && is(String, address))
    return EthUtil.toChecksumAddress(address)
  if (equals('BCH', coin)) {
    const selector =
      type !== ADDRESS_TYPES.LOCKBOX
        ? selectors.core.common.bch.getNextAvailableReceiveAddress
        : selectors.core.common.bch.getNextAvailableReceiveAddressLockbox
    const bchReceiveAddress = selector(networks.bch, address, appState)
    if (isEmpty(bchReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate bitcoin cash receive address')
    }
    return utils.bch.toCashAddr(bchReceiveAddress.getOrElse(''))
  }
  if (equals('BSV', coin)) {
    const selector = selectors.core.common.bsv.getNextAvailableReceiveAddress
    const bsvReceiveAddress = selector(networks.bsv, address, appState)
    if (isEmpty(bsvReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate bitcoin sv receive address')
    }
    return utils.bch.toCashAddr(bsvReceiveAddress.getOrElse(''))
  }
  if (equals('BTC', coin)) {
    const selector =
      type !== ADDRESS_TYPES.LOCKBOX
        ? selectors.core.common.btc.getNextAvailableReceiveAddress
        : selectors.core.common.btc.getNextAvailableReceiveAddressLockbox
    const btcReceiveAddress = selector(networks.btc, address, appState)
    if (isEmpty(btcReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate return bitcoin receive address')
    }
    return btcReceiveAddress.getOrElse('')
  }
  throw new Error('Could not generate receive address')
}

export const getBchAccounts = function*() {
  const appState = yield select(identity)
  const bchAccounts = selectors.core.wallet.getHDAccounts(appState)
  const bchData = selectors.core.data.bch
    .getAddresses(appState)
    .getOrFail('Can not retrieve bitcoin cash data.')
  const bchMetadata = selectors.core.kvStore.bch
    .getAccounts(appState)
    .getOrFail('Can not retrieve bitcoin cash metadata.')

  const transform = acc => {
    const index = prop('index', acc)
    const data = prop(prop('xpub', acc), bchData)
    const metadata = bchMetadata[index]
    return {
      archived: prop('archived', metadata),
      coin: 'BCH',
      text: prop('label', metadata) || prop('xpub', acc),
      address: index,
      balance: prop('final_balance', data)
    }
  }

  return bchAccounts.map(transform)
}

export const getActiveBchAccounts = function*() {
  const bchAccounts = yield call(getBchAccounts)
  return filter(propEq('archived', false), bchAccounts)
}

export const getBtcAccounts = function*() {
  const appState = yield select(identity)
  const btcAccounts = selectors.core.wallet.getHDAccounts(appState)
  const btcData = selectors.core.data.bitcoin
    .getAddresses(appState)
    .getOrFail('Can not retrieve bitcoin data.')

  const transform = acc => ({
    archived: prop('archived', acc),
    coin: 'BTC',
    text: prop('label', acc) || prop('xpub', acc),
    address: prop('index', acc),
    balance: prop('final_balance', prop(prop('xpub', acc), btcData))
  })

  return btcAccounts.map(transform)
}

export const getActiveBtcAccounts = function*() {
  const btcAccounts = yield call(getBtcAccounts)
  return filter(propEq('archived', false), btcAccounts)
}

export const getEthAccounts = function*() {
  const appState = yield select(identity)
  const ethData = selectors.core.data.ethereum
    .getAddresses(appState)
    .getOrFail('Can not retrieve ethereum data.')
  const ethMetadata = selectors.core.kvStore.ethereum
    .getAccounts(appState)
    .getOrFail('Can not retrieve ethereum metadata.')

  const transform = acc => {
    const data = prop(prop('addr', acc), ethData)
    return {
      archived: prop('archived', acc),
      coin: 'ETH',
      text: prop('label', acc) || prop('addr', acc),
      address: prop('addr', acc),
      balance: prop('balance', data)
    }
  }

  return ethMetadata.map(transform)
}

export const getActiveEthAccounts = function*() {
  const ethAccounts = yield call(getEthAccounts)
  return filter(propEq('archived', false), ethAccounts)
}
