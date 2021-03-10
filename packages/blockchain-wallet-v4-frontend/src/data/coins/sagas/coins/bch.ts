import { nth } from 'ramda'
import { select } from 'redux-saga/effects'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { PaymentValue } from 'blockchain-wallet-v4/src/redux/payment/types'
import {
  CoinType,
  CurrenciesType,
  RatesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

const { isCashAddr, toCashAddr } = utils.bch

// retrieves default account/address
export const getDefaultAccount = function * () {
  const bchAccountsR = yield select(
    selectors.core.common.bch.getAccountsBalances
  )
  const bchDefaultIndex = (yield select(
    selectors.core.kvStore.bch.getDefaultAccountIndex
  )).getOrElse(0)
  return bchAccountsR.map(nth(bchDefaultIndex))
}

// retrieves the next receive address
export const getNextReceiveAddress = function * (coin, networks) {
  const state = yield select()
  const defaultAccountIndex = (yield select(
    selectors.core.kvStore.bch.getDefaultAccountIndex
  )).getOrFail()
  const nextAddress = selectors.core.common.bch
    .getNextAvailableReceiveAddress(networks.bch, defaultAccountIndex, state)
    .getOrFail('Failed to get BCH receive address')

  return isCashAddr(nextAddress) ? nextAddress : toCashAddr(nextAddress)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function * (
  coreSagas,
  networks,
  paymentR
) {
  return yield coreSagas.payment.bch.create({
    payment: paymentR.getOrElse(<PaymentValue>{}),
    network: networks.bch
  })
}

// converts base unit (SAT) to fiat
export const convertFromBaseUnitToFiat = function(
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  return Exchange.convertBchToFiat({
    value: baseUnitValue,
    fromUnit: 'SAT',
    toCurrency: userCurrency,
    rates
  }).value
}
