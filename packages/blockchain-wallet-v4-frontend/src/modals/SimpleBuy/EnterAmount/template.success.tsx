import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Checkout from './Checkout'
import React from 'react'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = props => {
  return props.pairs.length &&
    props.eligibility.eligible &&
    props.paymentMethods.methods.length ? (
    <Checkout {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
