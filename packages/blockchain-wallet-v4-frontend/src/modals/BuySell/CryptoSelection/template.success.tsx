import React from 'react'

import { BuySellLimitReached } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'

const Success: React.FC<Props> = (props) => {
  const isUserEligible = props.pairs.length && props.eligibility.eligible && props.fiatCurrency
  const userHitMaxPendingDeposits =
    props.eligibility.maxPendingDepositSimpleBuyTrades ===
    props.eligibility.pendingDepositSimpleBuyTrades

  if (!isUserEligible && userHitMaxPendingDeposits) {
    return (
      <BuySellLimitReached
        handleClose={props.handleClose}
        limitNumber={props.eligibility.maxPendingDepositSimpleBuyTrades}
      />
    )
  }
  // now we always return this list
  return <CryptoSelector {...props} />
}

export type Props = OwnProps & SuccessStateType

export default Success
