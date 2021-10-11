import React from 'react'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = (props) => {
  const isUserEligible = props.pairs.length && props.eligibility.eligible && props.fiatCurrency
  const isUserSddEligible = props.sddEligible && props.sddEligible.eligible

  return isUserEligible || isUserSddEligible ? (
    <CryptoSelector {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType

export default Success
