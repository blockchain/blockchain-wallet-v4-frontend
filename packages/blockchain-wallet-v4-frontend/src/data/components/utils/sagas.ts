import { equals, identity, includes, is, isEmpty, prop } from 'ramda'
import { select } from 'redux-saga/effects'
import EthUtil from 'ethereumjs-util'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const selectReceiveAddress = function * (source, networks) {
  const appState = yield select(identity)
  const erc20List = (yield select(
    selectors.core.walletOptions.getErc20CoinList
  )).getOrFail()
  const coin = prop('coin', source)
  const type = prop('type', source)
  const address = prop('address', source)
  if (equals('XLM', coin) && is(String, address)) return address
  if (
    (includes(coin, erc20List) || equals('ETH', coin)) &&
    is(String, address)
  ) {
    return EthUtil.toChecksumAddress(address)
  }
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
  if (equals('BTC', coin)) {
    let btcReceiveAddress
    if (type === ADDRESS_TYPES.LOCKBOX) {
      btcReceiveAddress = yield select(selectors.core.common.btc.getNextAvailableReceiveAddressLockbox(networks.btc, address, appState))
    } else {
      const defaultDerivation = yield select(selectors.core.common.btc.getAccountDefaultDerivation(address, appState))
      btcReceiveAddress = yield select(selectors.core.common.btc.getNextAvailableReceiveAddress(networks.btc, address, defaultDerivation, appState))
    }
    if (isEmpty(btcReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate return bitcoin receive address')
    }
    return btcReceiveAddress.getOrElse('')
  }
  throw new Error('Could not generate receive address')
}
