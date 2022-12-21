import React from 'react'

import { FiatType } from '@core/types'

import { Props as OwnProps, SuccessStateType } from '.'
import Checkout from './Checkout'
import Unsupported from './template.unsupported'

const Success = (props: Props) => {
  const isUserEligible =
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find(
      (method) => method.limits?.max !== '0' && method.currency === props.fiatCurrency
    )

  return isUserEligible ? <Checkout {...props} /> : <Unsupported {...props} />
}

export type Props = OwnProps & SuccessStateType & { cryptoCurrency: string; fiatCurrency: FiatType }

export default Success
