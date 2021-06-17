import { head } from 'ramda'
import { select } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { UnitType } from 'blockchain-wallet-v4/src/exchange'
import { CoinType, CurrenciesType, PaymentValue, RatesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

// retrieves default account/address
export const getDefaultAccount = function* (coin: CoinType) {
  const erc20AccountR = yield select(selectors.core.common.eth.getErc20AccountBalances, coin)
  return erc20AccountR.map(head)
}

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType) {
  return selectors.core.data.eth
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

// converts base unit (WEI) to fiat
// TODO: need to refactor further to avoid explicit switch cases
export const convertFromBaseUnitToFiat = function (
  coin: CoinType,
  baseUnitValue: number | string,
  userCurrency: keyof CurrenciesType,
  rates: RatesType
): number {
  const convertRequest = {
    fromUnit: 'WEI' as UnitType,
    rates: rates as RatesType,
    toCurrency: userCurrency as keyof CurrenciesType,
    value: baseUnitValue as string
  }

  switch (coin) {
    case 'AAVE':
      return Exchange.convertAaveToFiat(convertRequest).value
    case 'PAX':
      return Exchange.convertPaxToFiat(convertRequest).value
    case 'USDT':
      return Exchange.convertUsdtToFiat(convertRequest).value
    case 'WDGLD':
      return Exchange.convertWdgldToFiat(convertRequest).value
    case 'YFI':
      return Exchange.convertYfiToFiat(convertRequest).value
    default:
      // eslint-disable-next-line
      console.error('Unknown ERC20 to convert')
      return 0
  }
}
