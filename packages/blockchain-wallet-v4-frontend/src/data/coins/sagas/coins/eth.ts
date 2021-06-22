import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { PaymentValue } from 'blockchain-wallet-v4/src/redux/payment/types'
import { CoinType, CurrenciesType, RatesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function* () {
  const ethAccountR = yield select(selectors.core.common.eth.getAccountBalances)
  return ethAccountR.map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function* () {
  return selectors.core.data.eth
    .getDefaultAddress(yield select())
    .getOrFail(`Failed to get ETH receive address`)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function* (coreSagas, networks, paymentR) {
  return yield coreSagas.payment.eth.create({
    network: networks.eth,
    payment: paymentR.getOrElse(<PaymentValue>{})
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
    fromUnit: 'WEI',
    rates,
    toCurrency: userCurrency,
    value: baseUnitValue
  }).value
}
