import { nth } from 'ramda'
import { select } from 'redux-saga/effects'

import { PaymentValue } from 'blockchain-wallet-v4/src/redux/payment/types'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function * () {
  const btcAccountsR = yield select(
    selectors.core.common.btc.getAccountsBalances
  )
  const btcDefaultIndex = yield select(
    selectors.core.wallet.getDefaultAccountIndex
  )
  return btcAccountsR.map(nth(btcDefaultIndex))
}

// retrieves the next receive address
export const getNextReceiveAddress = function * (_, networks, index) {
  const state = yield select()
  const defaultAccountIndex =
    index || (yield select(selectors.core.wallet.getDefaultAccountIndex))

  const defaultDerivation = selectors.core.common.btc.getAccountDefaultDerivation(
    defaultAccountIndex,
    state
  )

  return selectors.core.common.btc
    .getNextAvailableReceiveAddress(
      networks.btc,
      defaultAccountIndex,
      defaultDerivation,
      state
    )
    .getOrFail('Failed to get BTC receive address')
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function * (
  coreSagas,
  networks,
  paymentR
) {
  return yield coreSagas.payment.btc.create({
    payment: paymentR.getOrElse(<PaymentValue>{}),
    network: networks.btc
  })
}
