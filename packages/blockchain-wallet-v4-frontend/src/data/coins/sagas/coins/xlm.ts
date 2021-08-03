import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { PaymentValue } from 'blockchain-wallet-v4/src/redux/payment/types'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function * () {
  return (yield select(selectors.core.common.xlm.getAccountBalances)).map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function * () {
  return selectors.core.kvStore.xlm
    .getDefaultAccountId(yield select())
    .getOrFail(`Failed to get XLM receive address`)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function * (
  coreSagas,
  networks,
  paymentR
) {
  return yield coreSagas.payment.xlm.create({
    payment: paymentR.getOrElse(<PaymentValue>{})
  })
}
