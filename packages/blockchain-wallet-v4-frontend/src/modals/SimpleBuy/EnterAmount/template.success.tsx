import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import Checkout from './Checkout'
import React from 'react'
import Unsupported from './template.unsupported'

export type Props = OwnProps & SuccessStateType & LinkDispatchPropsType

const Success: React.FC<Props> = props => {
  return props.pairs.length ? (
    <Checkout {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export default Success
