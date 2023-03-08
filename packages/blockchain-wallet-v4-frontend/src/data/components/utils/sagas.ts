import * as ethers from 'ethers'
import { equals, is, prop } from 'ramda'
import { call } from 'redux-saga/effects'

import { AccountType } from 'data/coins/accountTypes/accountTypes'

import { sagas as nonCustodialCoinSagas } from '../../coins/accountTypes/nonCustodial'

export const selectReceiveAddress = function* (source) {
  const coin = prop('coin', source)
  const address = prop('address', source)
  const { coinfig } = window.coins[coin]

  if ((coinfig.type.erc20Address || equals('ETH', coin)) && is(String, address)) {
    return ethers.utils.getAddress(address)
  }

  try {
    const address = yield call(
      nonCustodialCoinSagas.getNextReceiveAddress,
      AccountType.NON_CUSTODIAL,
      coin
    )
    return address.address
  } catch (e) {
    throw new Error('Could not generate receive address')
  }
}

export default selectReceiveAddress
