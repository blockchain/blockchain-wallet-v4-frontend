import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { propEq } from 'ramda'

import { Exchange } from '@core'
import { convertCoinToFiat } from '@core/exchange'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { InterestWithdrawalFormType } from 'data/types'

export const maximumWithdrawalAmount = (
  value: string,
  allValues: InterestWithdrawalFormType,
  props: any
) => {
  const { availToWithdraw, coin, displayCoin, rates, walletCurrency } = props
  const availToWithdrawCrypto = convertBaseToStandard(coin, availToWithdraw)
  const withdrawalLimit = displayCoin
    ? availToWithdrawCrypto
    : convertCoinToFiat({
        coin,
        currency: walletCurrency,
        isStandard: true,
        rates,
        value: availToWithdrawCrypto
      })
  return new BigNumber(Number(withdrawalLimit)).isLessThan(Number(value)) ? (
    <FormattedMessage
      id='interest.withdrawal.validation.abovemax'
      defaultMessage='Amount is above the maximum withdrawal amount.'
    />
  ) : (
    false
  )
}

export const minimumWithdrawalAmount = (
  value: string,
  allValues: InterestWithdrawalFormType,
  props: any
) => {
  const { coin, displayCoin, walletCurrency } = props
  const withdrawalMin = convertBaseToStandard(coin, '1')

  return new BigNumber(Number(withdrawalMin)).isGreaterThan(Number(value)) ? (
    <FormattedMessage
      id='interest.withdrawal.validation.belowminamount'
      defaultMessage='Amount is below the minimum withdrawal amount of {withdrawalMin} {currency}.'
      values={{
        currency: displayCoin ? coin : walletCurrency,
        withdrawalMin
      }}
    />
  ) : (
    false
  )
}
