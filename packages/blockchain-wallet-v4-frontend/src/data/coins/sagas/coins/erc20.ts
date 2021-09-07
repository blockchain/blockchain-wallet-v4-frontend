import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { CoinType, PaymentValue } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function* (coin: CoinType) {
  const erc20AccountR = yield select(selectors.core.common.eth.getErc20AccountBalances, coin)
  return erc20AccountR.map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType) {
  return selectors.core.kvStore.eth
    .getDefaultAddress(yield select())
    .getOrFail(`Failed to get ${coin} receive address`)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function* (coreSagas, networks, paymentR) {
  return yield coreSagas.payment.eth.create({
    network: networks.eth,
    payment: paymentR.getOrElse(<PaymentValue>{})
  })
}
