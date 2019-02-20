import { Exchange } from 'blockchain-wallet-v4/src'
import { BigNumber } from 'bignumber.js'
import { currencySymbolMap } from 'services/CoinifyService'

const convertXlmToFiat = (rates, currency) => amount =>
  Exchange.convertXlmToFiat({
    value: amount,
    fromUnit: 'XLM',
    toCurrency: currency,
    rates: rates
  }).value

export const getData = (state, props) => {
  const { reserveXlm, rates, effectiveBalanceXlm, currency, fee } = props
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
