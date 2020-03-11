import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { BorrowFormValuesType } from 'data/types'
import { FormattedMessage } from 'react-intl'
import { Props } from './template.success'
import BigNumber from 'bignumber.js'
import React from 'react'

export const maximumAmount = (
  value: string,
  allValues: BorrowFormValuesType,
  props: Props
) => {
  return new BigNumber(props.limits.maxFiat).isLessThan(Number(value)) ? (
    <FormattedMessage
      id='borrow.validation.abovemax'
      defaultMessage='The amount you entered is above the maximum amount.'
    />
  ) : (
    false
  )
}

export const minimumAmount = (
  value: string,
  allValues: BorrowFormValuesType,
  props: Props
) => {
  if (!value) return true
  return new BigNumber(value).isLessThan(props.limits.minFiat) ? (
    <FormattedMessage
      id='borrow.validation.belowmin'
      defaultMessage='The amount you entered is below the minimum amount of {minFiat}.'
      values={{
        minFiat: Currency.fiatToString({
          value: props.limits.minFiat,
          unit: { symbol: '$' }
        })
      }}
    />
  ) : (
    false
  )
}
