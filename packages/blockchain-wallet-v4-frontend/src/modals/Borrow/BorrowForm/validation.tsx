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
  allValues: BorrowFormValuesType
) => {
  if (!value) return true
  return new BigNumber(0).isGreaterThanOrEqualTo(value) ? (
    <FormattedMessage
      id='borrow.validation.belowmin'
      defaultMessage='The amount you entered is below the minimum amount.'
    />
  ) : (
    false
  )
}
