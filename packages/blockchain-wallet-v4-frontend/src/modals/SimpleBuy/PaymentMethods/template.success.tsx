import React from 'react'

import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Methods from './Methods'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = (props) => {
  const isUserEligible =
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find((method) => method.limits.max !== '0')

  return isUserEligible ? <Methods {...props} /> : <Unsupported {...props} />
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
