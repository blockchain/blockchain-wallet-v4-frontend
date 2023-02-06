import * as ethers from 'ethers'
import { equals, is, prop } from 'ramda'
import { call } from 'redux-saga/effects'

import { CoinAccountTypeEnum } from 'data/coins/accountTypes/accountTypes.classes'

import coinSagas from '../../coins/sagas'

export const selectReceiveAddress = function* (source, networks, api, coreSagas) {
  const { getNextReceiveAddressForCoin } = coinSagas({
    api,
    coreSagas,
    networks
  })

  const coin = prop('coin', source)
  const address = prop('address', source)
  const { coinfig } = window.coins[coin]

  if ((coinfig.type.erc20Address || equals('ETH', coin)) && is(String, address)) {
    return ethers.utils.getAddress(address)
  }

  try {
    const address: ReturnType<typeof getNextReceiveAddressForCoin> = yield call(
      getNextReceiveAddressForCoin,
      CoinAccountTypeEnum.NON_CUSTODIAL,
      coin
    )
    return address.address
  } catch (e) {
    throw new Error('Could not generate receive address')
  }
}

export default selectReceiveAddress
