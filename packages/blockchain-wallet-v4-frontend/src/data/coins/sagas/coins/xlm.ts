import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { PaymentValue } from 'blockchain-wallet-v4/src/redux/payment/types'
import {
  CoinType,
  CurrenciesType,
  RatesType
} from 'blockchain-wallet-v4/src/types'
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

// converts base unit (STROOP) to fiat
export const convertFromBaseUnitToFiat = function(
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  return Exchange.convertXlmToFiat({
    value: baseUnitValue,
    fromUnit: 'STROOP',
    toCurrency: userCurrency,
    rates
  }).value
}
