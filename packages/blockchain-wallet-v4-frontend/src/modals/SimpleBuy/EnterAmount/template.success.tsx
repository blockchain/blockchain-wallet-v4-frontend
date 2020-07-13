import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Checkout from './Checkout'
import React, { useEffect } from 'react'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = props => {
  const isUserEligible =
    props.pairs.length &&
    props.eligibility.eligible &&
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find(method => method.limits.max !== '0')

  useEffect(() => {
    props.analyticsActions.logEvent([
      'IS_USER_SB_ELIGIBLE',
      JSON.stringify({
        pairs: props.pairs,
        eligibility: props.eligibility,
        paymentMethods: props.paymentMethods,
        doesWalletConsiderUserEligible: !!isUserEligible
      })
    ])
  }, [])

  return isUserEligible ? <Checkout {...props} /> : <Unsupported {...props} />
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
