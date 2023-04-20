import { convertCoinToCoin, convertFiatToCoin } from '@core/exchange'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { StakingWithdrawalFormType } from 'data/types'

import { Props } from './WithdrawalForm.template.success'

const maximumAmount = (amount: string, balance: string | number): boolean | string => {
  if (!amount) return false

  return Number(amount) > Number(balance)
}

const minimumAmount = (amount: string, min: number) => {
  if (!amount) return false

  return Number(amount) < Number(min)
}

export const validate = (formValues: StakingWithdrawalFormType, props: Props) => {
  const { accountBalance, coin, rates, walletCurrency } = props
  const { amount, fix } = formValues
  if (!amount) return true

  const minWithdrawalLimit = convertBaseToStandard(coin, '1')
  const cryptoStandardAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 18,
          rates,
          value: amount
        })
      : amount

  const cryptoBaseAmt = convertCoinToCoin({
    baseToStandard: false,
    coin,
    value: cryptoStandardAmt
  })

  const isBelowMin = minimumAmount(cryptoStandardAmt, Number(minWithdrawalLimit))

  const isAboveMax = maximumAmount(cryptoBaseAmt, accountBalance.earningBalance)

  return {
    amount: isBelowMin ? 'BELOW_MIN' : isAboveMax ? 'ABOVE_MAX' : false
  }
}
