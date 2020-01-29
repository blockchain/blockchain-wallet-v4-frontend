import { BorrowFormValuesType } from 'data/types'
import { Props } from './template.success'
import BigNumber from 'bignumber.js'
// import { FormattedMessage } from 'react-intl'
// import React from 'react'

export const maximumAmount = (
  value: string,
  allValues: BorrowFormValuesType,
  props: Props
) => {
  return new BigNumber(props.limits.maxFiat).isLessThan(Number(value))
}

export const minimumAmount = (
  value: string,
  allValues: BorrowFormValuesType
) => {
  if (!value) return true
  return new BigNumber(0).isGreaterThanOrEqualTo(value)
}
