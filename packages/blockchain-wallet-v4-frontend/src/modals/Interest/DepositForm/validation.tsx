import { FormattedMessage } from 'react-intl'
import { InterestDepositFormType } from 'data/types'
import BigNumber from 'bignumber.js'
import React from 'react'

import { fiatToString } from 'core/exchange/currency'

import { Props as DepositProps } from './template.success'

export const minDepositAmount = (
  value: string,
  allValues: InterestDepositFormType,
  props: DepositProps
) => {
  if (!value) return true
  // TODO: hook into real data
  const min = 1 // props.limits[props.coin]?.minimumDeposit || 0

  return new BigNumber(value).isLessThan(min) ? (
    <FormattedMessage
      id='modals.interest.deposit.min'
      defaultMessage='You must deposit at least {minFiat}'
      values={{
        minFiat: fiatToString({
          value: min,
          unit: props.walletCurrency
        })
      }}
    />
  ) : (
    false
  )
}

export const maxDepositAmount = (
  maxValue: number,
  props: DepositProps,
  value?: number
) => {
  if (!value) return true

  return new BigNumber(maxValue).isLessThan(value) ? (
    <FormattedMessage
      id='modals.interest.deposit.max'
      defaultMessage='You cannot deposit more than {maxFiat}'
      values={{
        maxFiat: fiatToString({
          value: maxValue,
          unit: props.walletCurrency
        })
      }}
    />
  ) : (
    false
  )
}
