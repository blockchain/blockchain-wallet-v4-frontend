import { BigNumber } from 'bignumber.js'
import { mapObjIndexed } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

const currencySymbolMap = mapObjIndexed(
  (value, code) => value.units[code].symbol,
  Currencies
)

const convertXlmToFiat = (rates, currency) => amount =>
  Exchange.convertXlmToFiat({
    value: amount,
    fromUnit: 'XLM',
    toCurrency: currency,
    rates: rates
  }).value

export const getData = (state, props) => {
  const { currency, effectiveBalanceXlm, fee, rates, reserveXlm } = props
  const convertToFiat = convertXlmToFiat(rates, currency)
  const totalAmountXlm = new BigNumber.sum(
    effectiveBalanceXlm,
    reserveXlm
  ).toString()
  const totalAmountFiat = convertToFiat(totalAmountXlm)
  const reserveFiat = convertToFiat(reserveXlm)
  const feeXlm = Exchange.convertXlmToXlm({
    value: fee,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const feeFiat = convertToFiat(feeXlm)
  const effectiveBalanceMinusFeeBig = new BigNumber(effectiveBalanceXlm).minus(
    feeXlm
  )
  const effectiveBalanceMinusFeeXlm = effectiveBalanceMinusFeeBig.lt(0)
    ? '0'
    : effectiveBalanceMinusFeeBig.toString()
  const effectiveBalanceMinusFeeFiat = convertToFiat(
    effectiveBalanceMinusFeeXlm
  )
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
