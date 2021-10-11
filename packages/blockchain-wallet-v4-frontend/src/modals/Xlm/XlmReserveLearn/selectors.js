import { BigNumber } from 'bignumber.js'
import { mapObjIndexed } from 'ramda'

import { Exchange } from '@core'
import Currencies from '@core/exchange/currencies'

const currencySymbolMap = mapObjIndexed((value, code) => value.units[code].symbol, Currencies)

const convertXlmToFiat = (rates, currency) => (amount) =>
  Exchange.convertCoinToFiat({ coin: 'XLM', currency, isStandard: true, rates, value: amount })

export const getData = (state, props) => {
  const { currency, effectiveBalanceXlm, fee, rates, reserveXlm } = props
  const convertToFiat = convertXlmToFiat(rates, currency)
  const totalAmountXlm = new BigNumber.sum(effectiveBalanceXlm, reserveXlm).toString()
  const totalAmountFiat = convertToFiat(totalAmountXlm)
  const reserveFiat = convertToFiat(reserveXlm)
  const feeXlm = Exchange.convertCoinToCoin({
    coin: 'XLM',
    value: fee
  })
  const feeFiat = convertToFiat(feeXlm)
  const effectiveBalanceMinusFeeBig = new BigNumber(effectiveBalanceXlm).minus(feeXlm)
  const effectiveBalanceMinusFeeXlm = effectiveBalanceMinusFeeBig.lt(0)
    ? '0'
    : effectiveBalanceMinusFeeBig.toString()
  const effectiveBalanceMinusFeeFiat = convertToFiat(effectiveBalanceMinusFeeXlm)
  const currencySymbol = currencySymbolMap[currency]

  return {
    currencySymbol,
    effectiveBalanceMinusFeeFiat,
    effectiveBalanceMinusFeeXlm,
    feeFiat,
    feeXlm,
    reserveFiat,
    reserveXlm,
    totalAmountFiat,
    totalAmountXlm
  }
}

export default getData
