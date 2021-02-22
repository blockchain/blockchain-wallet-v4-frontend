import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { selectors } from 'data'
import { PaymentValue } from 'core/redux/payment/types'
import { CoinType, CurrenciesType, RatesType } from 'core/types'
import { Exchange } from 'core'

// retrieves default account/address
export const getDefaultAccount = function * () {
  const ethAccountR = yield select(selectors.core.common.eth.getAccountBalances)
  return ethAccountR.map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function * () {
  return selectors.core.data.eth
    .getDefaultAddress(yield select())
    .getOrFail(`Failed to get ETH receive address`)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function * (coreSagas, networks, paymentR) {
  return yield coreSagas.payment.eth.create({
    payment: paymentR.getOrElse(<PaymentValue>{}),
    network: networks.eth
  })
}

// converts base unit (WEI) to fiat
export const convertFromBaseUnitToFiat = function (
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  return Exchange.convertEthToFiat({
    value: baseUnitValue,
    fromUnit: 'WEI',
    toCurrency: userCurrency,
    rates
  }).value
}