import { nth } from 'ramda'
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
  const btcAccountsR = yield select(
    selectors.core.common.btc.getAccountsBalances
  )
  const btcDefaultIndex = yield select(
    selectors.core.wallet.getDefaultAccountIndex
  )
  return btcAccountsR.map(nth(btcDefaultIndex))
}

// retrieves the next receive address
export const getNextReceiveAddress = function * (coin, networks) {
  const state = yield select()
  const defaultAccountIndex = yield select(
    selectors.core.wallet.getDefaultAccountIndex
  )

  return selectors.core.common.btc
    .getNextAvailableReceiveAddress(networks.btc, defaultAccountIndex, state)
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

// converts base unit (SAT) to fiat
export const convertFromBaseUnitToFiat = function(
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  return Exchange.convertBtcToFiat({
    value: baseUnitValue,
    fromUnit: 'SAT',
    toCurrency: userCurrency,
    rates
  }).value
}
