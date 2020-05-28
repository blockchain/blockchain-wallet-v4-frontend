import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import React from 'react'

import { InterestWithdrawalFormType } from 'data/types'

export const maximumWithdrawalAmount = (
  value: string,
  allValues: InterestWithdrawalFormType,
  props: any
) => {
  return new BigNumber(Number(props.availToWithdraw)).isLessThan(
    Number(value)
  ) ? (
    <FormattedMessage
      id='interest.withdrawal.validation.abovemax'
      defaultMessage='Amount is above the maximum withdrawal amount.'
    />
  ) : (
    false
  )
}

export const minimumWithdrawalAmount = (value: string) => {
  // someday there may be a minimum withdrawal amount
  const MIN_WITHDRAWAL = 0
  return new BigNumber(Number(MIN_WITHDRAWAL)).isGreaterThanOrEqualTo(
    Number(value)
  ) ? (
    <FormattedMessage
      id='interest.withdrawal.validation.belowmin'
      defaultMessage='Amount is below the minimum withdrawal amount.'
    />
  ) : (
    false
  )
}
