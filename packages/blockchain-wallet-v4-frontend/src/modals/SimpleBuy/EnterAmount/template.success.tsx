import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnProps,
  SuccessStateType
} from '.'
import Checkout from './Checkout'
import React from 'react'
import Unsupported from './template.unsupported'

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType

const Success: React.FC<Props> = props => {
  return props.pairs.length && props.eligibility.eligible ? (
    <Checkout {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export default Success
