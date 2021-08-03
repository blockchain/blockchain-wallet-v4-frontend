import EthUtil from 'ethereumjs-util'
import { equals, identity, is, isEmpty, prop } from 'ramda'
import { select } from 'redux-saga/effects'

import { utils } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const selectReceiveAddress = function* (source, networks) {
  const appState = yield select(identity)
  const coin = prop('coin', source)
  const address = prop('address', source)
  const { coinfig } = window.coins[coin]
  if (equals('XLM', coin) && is(String, address)) return address
  if ((coinfig.type.erc20Address || equals('ETH', coin)) && is(String, address)) {
    return EthUtil.toChecksumAddress(address)
  }
  if (equals('BCH', coin)) {
    const bchReceiveAddress = selectors.core.common.bch.getNextAvailableReceiveAddress(
      networks.bch,
      address,
      appState
    )
    if (isEmpty(bchReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate bitcoin cash receive address')
    }
    return utils.bch.toCashAddr(bchReceiveAddress.getOrElse(''))
  }
  if (equals('BTC', coin)) {
    const defaultDerivation = selectors.core.common.btc.getAccountDefaultDerivation(
      address,
      appState
    )
    const btcReceiveAddress = selectors.core.common.btc.getNextAvailableReceiveAddress(
      networks.btc,
      address,
      defaultDerivation,
      appState
    )
    if (isEmpty(btcReceiveAddress.getOrElse(''))) {
      throw new Error('Could not generate return bitcoin receive address')
    }
    return btcReceiveAddress.getOrElse('')
  }
  throw new Error('Could not generate receive address')
}

export default selectReceiveAddress
