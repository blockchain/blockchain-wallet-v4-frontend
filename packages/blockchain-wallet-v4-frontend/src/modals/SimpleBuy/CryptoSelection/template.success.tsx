import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import React from 'react'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = props => {
  return props.pairs.length &&
    props.eligibility.eligible &&
    props.fiatCurrency ? (
    <CryptoSelector {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
