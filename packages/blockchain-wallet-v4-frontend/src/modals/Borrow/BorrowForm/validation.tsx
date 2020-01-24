import { BorrowFormValuesType } from 'data/types'
import BigNumber from 'bignumber.js'
// import { FormattedMessage } from 'react-intl'
// import React from 'react'

export const maximumAmount = (
  value: string,
  allValues: BorrowFormValuesType
) => {
  if (allValues.maxCollateralCounter !== undefined) {
    return new BigNumber(allValues.maxCollateralCounter).isLessThan(
      Number(value)
    )
  }
}

export const minimumAmount = (
  value: string,
  allValues: BorrowFormValuesType
) => {
  if (!value) return true
  return new BigNumber(0).isGreaterThanOrEqualTo(value)
}
