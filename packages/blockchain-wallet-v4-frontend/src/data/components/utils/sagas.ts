import * as ethers from 'ethers'
import { equals, identity, is, isEmpty, prop } from 'ramda'
import { call, select } from 'redux-saga/effects'

import { utils } from '@core'
import { selectors } from 'data'

import coinSagas from '../../coins/sagas'

export const selectReceiveAddress = function* (source, networks, api, coreSagas) {
  const { getNextReceiveAddressForCoin } = coinSagas({
    api,
    coreSagas,
    networks
  })

  const appState = yield select(identity)
  const coin = prop('coin', source)
  const address = prop('address', source)
  const { coinfig } = window.coins[coin]

  if ((coinfig.type.erc20Address || equals('ETH', coin)) && is(String, address)) {
    return ethers.utils.getAddress(address)
  }

  if (equals('XLM', coin) && is(String, address)) return address

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

  try {
    const address = yield call(getNextReceiveAddressForCoin, coin)
    return address
  } catch (e) {
    throw new Error('Could not generate receive address')
  }
}

export default selectReceiveAddress
