import React from 'react'
import { equals } from 'ramda'

import { BuySellLimitReached } from 'components/Flyout/Brokerage'

import { Props as OwnProps, SuccessStateType } from '.'
import CryptoSelector from './CryptoSelector'

class Success extends React.Component<Props> {
  shouldComponentUpdate = (nextProps) => !equals(this.props, nextProps)

  render() {
    const isUserEligible =
      this.props.pairs.length && this.props.eligibility.eligible && this.props.fiatCurrency
    const userHitMaxPendingDeposits =
      this.props.eligibility.maxPendingDepositSimpleBuyTrades ===
      this.props.eligibility.pendingDepositSimpleBuyTrades

    if (!isUserEligible && userHitMaxPendingDeposits) {
      return (
        <BuySellLimitReached
          handleClose={this.props.handleClose}
          limitNumber={this.props.eligibility.maxPendingDepositSimpleBuyTrades}
        />
      )
    }
    // now we always return this list
    return <CryptoSelector {...this.props} />
  }
}

export type Props = OwnProps & SuccessStateType

export default Success
