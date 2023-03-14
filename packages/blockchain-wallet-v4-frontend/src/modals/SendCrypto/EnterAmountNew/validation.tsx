import { convertCoinToCoin, convertFiatToCoin } from '@core/exchange'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { SwapBaseCounterTypes } from 'data/types'

import { SendFormType } from '../types'
import { Props } from '.'

const maximumAmount = (amount: string, balance: string | number, fee: string): boolean | string => {
  if (!amount) return false

  return Number(amount) > Number(balance) - Number(fee)
}

const maximumAmountWithLimit = (
  amount: string,
  balance: string | number,
  limit: string | number,
  fee: string
): boolean | string => {
  if (!amount) return false

  // check current amount vs limit, also check is limit + fee in available balance
  return Number(amount) > Number(limit) && Number(limit) + Number(fee) <= Number(balance)
}

const minimumAmount = (amount: string, min: number) => {
  if (!amount) return false

  return Number(amount) < Number(min)
}

export const validate = (formValues: SendFormType, props: Props) => {
  const { feesR, minR, rates, sendLimits, walletCurrency: currency } = props
  const { amount, fix, selectedAccount } = formValues
  const { coin } = selectedAccount

  const fee = selectedAccount.type === SwapBaseCounterTypes.ACCOUNT ? 0 : feesR.getOrElse(0) || 0
  const min = minR.getOrElse(0) || 0

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

  const isBelowMin = minimumAmount(cryptoStandardAmt, min)
  let isAboveMax = maximumAmount(cryptoBaseAmt, selectedAccount.balance, feeBaseAmt)

  // do this only for seamless limits and if amount is below current balance
  if (sendLimits?.current?.available && !isAboveMax) {
    const { value: limitAmount } = sendLimits.current.available

    const limitAmountInBase = convertBaseToStandard('FIAT', limitAmount)

    const maxLimit =
      fix === 'FIAT'
        ? limitAmountInBase
        : convertFiatToCoin({
            coin,
            currency,
            maxPrecision: 8,
            rates,
            value: limitAmountInBase
          })
    isAboveMax = maximumAmountWithLimit(amount, selectedAccount.balance, maxLimit, feeBaseAmt)
    if (isAboveMax) {
      return {
        amount: 'ABOVE_MAX_LIMIT'
      }
    }
  }

  return {
    amount: isBelowMin ? 'BELOW_MIN' : isAboveMax ? 'ABOVE_MAX' : false
  }
}
