import React, { useEffect } from 'react'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = (props) => {
  const isUserEligible = props.pairs.length && props.eligibility.eligible && props.fiatCurrency
  const isUserSddEligible = props.sddEligible && props.sddEligible.eligible

  useEffect(() => {
    props.analyticsActions.logEvent([
      'IS_USER_SB_ELIGIBLE',
      JSON.stringify({
        doesWalletConsiderUserEligible: !!isUserEligible,
        eligibility: props.eligibility,
        pairs: props.pairs
      })
    ])
    props.analyticsActions.logEvent([
      'IS_USER_SDD_ELIGIBLE',
      JSON.stringify({
        eligibility: isUserSddEligible,
        pairs: props.pairs
      })
    ])
  }, [])

  return isUserEligible || isUserSddEligible ? (
    <CryptoSelector {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType

export default Success
