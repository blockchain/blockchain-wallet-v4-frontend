import React from 'react'

import { BuySellLimitReached } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import Unsupported from './template.unsupported'

const Success: React.FC<Props> = (props) => {
  const isUserEligible = props.pairs.length && props.eligibility.eligible && props.fiatCurrency
  const isUserSddEligible = props.sddEligible && props.sddEligible.eligible
  const userHitMaxPendingDeposits =
    props.eligibility.maxPendingDepositSimpleBuyTrades ===
    props.eligibility.pendingDepositSimpleBuyTrades

  if (isUserEligible || isUserSddEligible) {
    return <CryptoSelector {...props} />
  }
  if (!isUserEligible && userHitMaxPendingDeposits) {
    return (
      <BuySellLimitReached
        handleClose={props.handleClose}
        limitNumber={props.eligibility.maxPendingDepositSimpleBuyTrades}
      />
    )
  }
  return <Unsupported {...props} />
}

export type Props = OwnProps & SuccessStateType

export default Success
