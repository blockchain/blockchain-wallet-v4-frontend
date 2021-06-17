import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const ErrorCodeMappings = ({ code }: { code: number | string }) => {
  switch (code) {
    case 41:
      return <FormattedMessage id='error.below_min' defaultMessage='Order below min size limit' />
    case 43:
      return <FormattedMessage id='error.above_max' defaultMessage='Order above max size limit' />
    case 45:
      return (
        <FormattedMessage
          id='error.exceeded_daily'
          defaultMessage="You've reached your daily trading limit"
        />
      )
    case 46:
      return (
        <FormattedMessage
          id='error.exceeded_weekly'
          defaultMessage="You've reached your weekly trading limit"
        />
      )
    case 47:
      return (
        <FormattedMessage
          id='error.exceeded_annual'
          defaultMessage="You've reached your annual trading limit"
        />
      )
    case 51:
      return (
        <FormattedMessage
          id='error.trading_disabled'
          defaultMessage='Trading is temporarily disabled'
        />
      )
    case 53:
      return (
        <FormattedMessage id='error.pending_limit' defaultMessage='Pending orders limit reached' />
      )
    case 93:
      return <FormattedMessage id='error.invalid_address' defaultMessage='Invalid crypto address' />
    case 94:
      return <FormattedMessage id='error.invalid_crypto' defaultMessage='Invalid crypto currency' />
    case 131:
      return (
        <FormattedMessage id='error.insufficient_balance' defaultMessage='Insufficient balance' />
      )
    case 149:
      return <FormattedMessage id='error.invalid_fiat' defaultMessage='Invalid fiat currency' />
    case 151:
      return (
        <FormattedMessage
          id='error.disabled_direction'
          defaultMessage='Order direction is disabled'
        />
      )
    case 152:
      return (
        <FormattedMessage id='error.pending_withdrawal' defaultMessage='Pending withdrawal locks' />
      )
    case 155:
      return <FormattedMessage id='error.invalid_quote' defaultMessage='Invalid or expired quote' />
    case 156:
      return (
        <FormattedMessage id='error.swap_eligibility' defaultMessage='User not eligible for Swap' />
      )
    case 157:
      return (
        <FormattedMessage
          id='error.negative_amount'
          defaultMessage='Destination amount is negative'
        />
      )
    default:
      // If the error form the api is a string like a `description` or `message` just pipe it to the
      // UI else if its a numeric code that's not supported here show a default error message
      return typeof code === 'string' ? (
        <Text>{code}</Text>
      ) : (
        <FormattedMessage id='copy.unkown_error' defaultMessage='An unknown error has occurred.' />
      )
  }
}

export default ErrorCodeMappings
