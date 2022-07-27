import React from 'react'
import { FormattedMessage } from 'react-intl'

export const endingLessThanStarting = (value, allValues) => {
  if (!value) return false
  return value >= allValues.starting ? (
    <FormattedMessage
      id='copy.ending_less_than_starting'
      defaultMessage='Must be less than Starting Price'
    />
  ) : (
    false
  )
}

export const reserveGreaterThanStarting = (value, allValues) => {
  if (!value) return false
  return value <= allValues.starting ? (
    <FormattedMessage
      id='copy.ending_greater_than_starting'
      defaultMessage='Must be greater than Starting Price'
    />
  ) : (
    false
  )
}
