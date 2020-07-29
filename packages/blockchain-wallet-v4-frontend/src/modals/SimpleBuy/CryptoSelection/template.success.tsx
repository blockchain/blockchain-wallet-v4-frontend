import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import React, { useEffect } from 'react'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = props => {
  const isUserEligible =
    props.pairs.length && props.eligibility.eligible && props.fiatCurrency

  useEffect(() => {
    props.analyticsActions.logEvent([
      'IS_USER_SB_ELIGIBLE',
      JSON.stringify({
        pairs: props.pairs,
        eligibility: props.eligibility,
        doesWalletConsiderUserEligible: !!isUserEligible
      })
    ])
  }, [])

  return isUserEligible ? (
    <CryptoSelector {...props} />
  ) : (
    <Unsupported {...props} />
  )
}

export type Props = OwnProps & SuccessStateType

export default Success
