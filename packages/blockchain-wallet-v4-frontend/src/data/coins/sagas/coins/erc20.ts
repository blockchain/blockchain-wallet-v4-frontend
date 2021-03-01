import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { CoinType, CurrenciesType, PaymentValue, RatesType } from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function * (coin: CoinType) {
  const erc20AccountR = yield select(
    selectors.core.common.eth.getErc20AccountBalances,
    coin
  )
  return erc20AccountR.map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function * (coin: CoinType) {
  return selectors.core.data.eth
    .getDefaultAddress(yield select())
    .getOrFail(`Failed to get ${coin} receive address`)
}

// gets or updates a provisional payment
export const getOrUpdateProvisionalPayment = function * (
  coreSagas,
  networks,
  paymentR
) {
  return yield coreSagas.payment.eth.create({
    payment: paymentR.getOrElse(<PaymentValue>{}),
    network: networks.eth
  })
}

// converts base unit (WEI) to fiat
// TODO: need to refactor further to avoid explicit switch cases
export const convertFromBaseUnitToFiat = function (
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  switch (coin) {
    case 'PAX':
      return Exchange.convertPaxToFiat({
        value: baseUnitValue,
        fromUnit: 'WEI',
        toCurrency: userCurrency,
        rates
      }).value
    case 'USDT':
      return Exchange.convertUsdtToFiat({
        value: baseUnitValue,
        fromUnit: 'WEI',
        toCurrency: userCurrency,
        rates
      }).value
    case 'WDGLD':
      return Exchange.convertWdgldToFiat({
        value: baseUnitValue,
        fromUnit: 'WEI',
        toCurrency: userCurrency,
        rates
      }).value
    default:
      // eslint-disable-next-line
      console.error('Unknown ERC20 to convert')
      return 0
  }
}
