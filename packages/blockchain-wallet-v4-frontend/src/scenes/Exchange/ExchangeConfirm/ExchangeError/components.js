import React from 'react'
import { prop } from 'ramda'
import { model } from 'data'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
const {
  MISSING_DEVICE_ERROR,
  NO_TRADE_PERMISSION,
  SWAP_ERROR_CODES
} = model.components.exchange

const getErrorMessage = error =>
  SWAP_ERROR_CODES[prop('code', error)] || prop('type', error) || error

export const ErrorMessageHeader = ({ error }) => {
  switch (getErrorMessage(error)) {
    case 'ORDER_BELOW_MIN_LIMIT' || 'ORDER_ABOVE_MAX_LIMIT': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.marketsaremoving'
          defaultMessage='Markets are Moving 🚀'
        />
      )
    }
    case 'DAILY_LIMIT_EXCEEDED':
    case 'WEEKLY_LIMIT_EXCEEDED':
    case 'ANNUAL_LIMIT_EXCEEDED': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.whoathere'
          defaultMessage='Whoa! Hold your horses. 🐴'
        />
      )
    }
    case NO_TRADE_PERMISSION: {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.notradepermission'
          defaultMessage='You do not have permission to trade right now. Please try again later.'
        />
      )
    }
    case MISSING_DEVICE_ERROR: {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.missingdevice'
          defaultMessage='Lockbox device is missing'
        />
      )
    }
    default: {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.oopsheader'
          defaultMessage='Oops! Something went wrong.'
        />
      )
    }
  }
}

export const ErrorMessageBody = ({
  error,
  annualLimit,
  dailyLimit,
  min,
  max,
  symbol
}) => {
  switch (getErrorMessage(error)) {
    case 'ORDER_BELOW_MIN_LIMIT': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.orderbelowmin'
          defaultMessage='Due to market movement, your order value is now below the minimum required threshold of {symbol}{amount}.'
          values={{ ...min }}
        />
      )
    }
    case 'ORDER_ABOVE_MAX_LIMIT': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.orderabovemax'
          defaultMessage='Due to market movement, your order value is now above the maximum allowable threshold of {amount} {symbol}.'
          values={{ ...max }}
        />
      )
    }
    case 'ANNUAL_LIMIT_EXCEEDED': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.annuallimitexceeded'
          defaultMessage='There is a limit to how much crypto you can exchange. The value of your order must be less than your limit of {symbol}{annualLimit}.'
          values={{ symbol, annualLimit }}
        />
      )
    }
    case 'DAILY_LIMIT_EXCEEDED': {
      return (
        <FormattedMessage
          id='scenes.exchange.confirm.dailylimitexceeded'
          defaultMessage='There is a limit to how much crypto you can exchange. The value of your order must be less than your limit of {symbol}{dailyLimit}.'
          values={{ symbol, dailyLimit }}
        />
      )
    }
    default: {
      return (
        <FormattedHTMLMessage
          id='scenes.exchange.confirm.oopsmessage'
          defaultMessage="We're not sure what happened but we didn't receive your order details. Unfortunately, you're going to have to enter your order again. <b>System error: {error}</b>"
          values={{
            error: prop('message', error) || prop('description', error) || error
          }}
        />
      )
    }
  }
}

export const ErrorMessageButtons = ({ error, onBack, handleSubmit }) => {
  switch (getErrorMessage(error)) {
    case 'ORDER_BELOW_MIN_LIMIT': {
      return (
        <React.Fragment>
          <Button nature='primary' height='56px' size='17px' onClick={onBack}>
            <FormattedMessage
              id='scenes.exchange.confirm.updateorder'
              defaultMessage='Update Order'
            />
          </Button>
          <Button nature='empty-secondary' height='56px' size='17px'>
            <FormattedMessage
              id='scenes.exchange.confirm.moreinfo'
              defaultMessage='More Info'
            />
          </Button>
        </React.Fragment>
      )
    }
    default: {
      return (
        <Button
          nature='primary'
          height='56px'
          size='17px'
          onClick={handleSubmit}
        >
          <FormattedMessage
            id='scenes.exchange.confirm.tryagain'
            defaultMessage='Try Again'
          />
        </Button>
      )
    }
  }
}
