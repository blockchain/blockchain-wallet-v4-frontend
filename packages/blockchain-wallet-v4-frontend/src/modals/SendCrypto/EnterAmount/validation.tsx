import { convertCoinToCoin, convertFiatToCoin } from 'blockchain-wallet-v4/src/exchange'

import { SendFormType } from '../types'
import { Props } from '.'

const maximumAmount = (amount: string, balance: string | number, fee: string): boolean | string => {
  if (!amount) return false

  return Number(amount) > Number(balance) - Number(fee)
}

const minimumAmount = (amount: string, min: number) => {
  if (!amount) return false

  return Number(amount) < Number(min)
}

export const validate = (formValues: SendFormType, props: Props) => {
  const { feesR, minR, rates, walletCurrency: currency } = props
  const { amount, fix, selectedAccount } = formValues
  const { coin } = selectedAccount

  const fee = feesR.getOrElse(0) || 0
  const cryptoStandardAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const cryptoBaseAmt = convertCoinToCoin({
    baseToStandard: false,
    coin,
    value: cryptoStandardAmt
  })
  const feeBaseAmt = convertCoinToCoin({
    baseToStandard: false,
    coin,
    value: fee
  })

  const isBelowMin = minimumAmount(cryptoStandardAmt, minR.getOrElse(0) || 0)
  const isAboveMax = maximumAmount(cryptoBaseAmt, selectedAccount.balance, feeBaseAmt)

  return {
    amount: isBelowMin ? 'BELOW_MIN' : isAboveMax ? 'ABOVE_MAX' : false
  }
}
