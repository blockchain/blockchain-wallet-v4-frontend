import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import React from 'react'

import { fiatToString } from 'core/exchange/currency'

export const minDepositAmount = (minValue, walletCurrency) => value => {
  if (!value) return true

  return new BigNumber(value).isLessThan(minValue) ? (
    <FormattedMessage
      id='modals.interest.deposit.min'
      defaultMessage='Minimum deposit: {minFiat}'
      values={{
        minFiat: fiatToString({
          value: minValue,
          unit: walletCurrency
        })
      }}
    />
  ) : (
    false
  )
}
export const maxDepositAmount = (maxValue, walletCurrency) => value => {
  if (!value) return true

  return new BigNumber(maxValue).isLessThan(value) ? (
    <FormattedMessage
      id='modals.interest.deposit.max'
      defaultMessage='You cannot deposit more than {maxFiat}'
      values={{
        maxFiat: fiatToString({
          value: maxValue,
          unit: walletCurrency
        })
      }}
    />
  ) : (
    false
  )
}
