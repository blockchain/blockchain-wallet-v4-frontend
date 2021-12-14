import React from 'react'
import { equals } from 'ramda'

import { BuySellLimitReached } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'
import Unsupported from './template.unsupported'

class Success extends React.Component<Props> {
  shouldComponentUpdate = (nextProps) => !equals(this.props, nextProps)

  render() {
    const isUserEligible =
      this.props.pairs.length && this.props.eligibility.eligible && this.props.fiatCurrency
    const isUserSddEligible = this.props.sddEligible && this.props.sddEligible.eligible
    const userHitMaxPendingDeposits =
      this.props.eligibility.maxPendingDepositSimpleBuyTrades ===
      this.props.eligibility.pendingDepositSimpleBuyTrades
    if (isUserEligible || isUserSddEligible) {
      return <CryptoSelector {...this.props} />
    }
    if (!isUserEligible && userHitMaxPendingDeposits) {
      return (
        <BuySellLimitReached
          handleClose={this.props.handleClose}
          limitNumber={this.props.eligibility.maxPendingDepositSimpleBuyTrades}
        />
      )
    }
    return <Unsupported {...this.props} />
  }
}

export type Props = OwnProps & SuccessStateType

export default Success
