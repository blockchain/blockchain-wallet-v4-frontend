import { Props as DepositProps } from './template.success'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { InterestDepositFormType } from 'data/types'
import BigNumber from 'bignumber.js'
import React from 'react'

export const minimumAmount = (
  value: string,
  allValues: InterestDepositFormType,
  props: DepositProps
) => {
  if (!value) return true
  const min = props.limits[props.coin]?.minimumDeposit || 0

  return new BigNumber(value).isLessThan(min) ? (
    <FormattedMessage
      id='modals.interest.deposit.min'
      defaultMessage='Minimum deposit: {minFiat}'
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
