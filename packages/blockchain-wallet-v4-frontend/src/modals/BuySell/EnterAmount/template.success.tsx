import React from 'react'

import { BSPaymentTypes, OrderType } from '@core/types'

import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Checkout from './Checkout'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = (props) => {
  const isUserEligible =
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find(
      (method) => method.limits?.max !== '0' && method.currency === props.fiatCurrency
    )

  // Check to see if user can sell into their wallet's preferred currency
  // Handles the case where we support credit card buy for the currency but not sell, i.e. CAD
  const sellCurrencyAvailable =
    props.orderType === OrderType.BUY ||
    (props.orderType === OrderType.SELL &&
      props.paymentMethods.methods
        .filter((method) => method.type === BSPaymentTypes.FUNDS)
        .map((method) => method.currency)
        .includes(props.walletCurrency))

  return isUserEligible && sellCurrencyAvailable ? (
    <Checkout {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
