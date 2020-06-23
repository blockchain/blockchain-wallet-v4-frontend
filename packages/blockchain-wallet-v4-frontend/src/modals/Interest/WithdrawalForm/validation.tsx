import { convertBaseToStandard } from 'data/components/exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import React from 'react'

import { convertCoinToFiat } from 'core/exchange'
import { InterestWithdrawalFormType } from 'data/types'

export const maximumWithdrawalAmount = (
  value: string,
  allValues: InterestWithdrawalFormType,
  props: any
) => {
  const { coin, displayCoin, availToWithdraw, walletCurrency, rates } = props
  const availToWithdrawCrypto = convertBaseToStandard(coin, availToWithdraw)
  const withdrawalLimit = displayCoin
    ? availToWithdrawCrypto
    : convertCoinToFiat(availToWithdrawCrypto, coin, walletCurrency, rates)
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
  // withdrawal min across all products .0005 BTC
  const { coin, displayCoin, rates, walletCurrency } = props
  const MIN_WITHDRAWAL = coin === 'BTC' ? 0.0005 : 0.002
  const withdrawalMin = displayCoin
    ? MIN_WITHDRAWAL
    : Exchange.convertCoinToFiat(MIN_WITHDRAWAL, coin, walletCurrency, rates)

  return new BigNumber(Number(withdrawalMin)).isGreaterThan(Number(value)) ? (
    <FormattedMessage
      id='interest.withdrawal.validation.belowmin'
      defaultMessage='Amount is below the minimum withdrawal amount.'
    />
  ) : (
    false
  )
}
