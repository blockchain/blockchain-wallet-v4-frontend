import { Exchange } from 'blockchain-wallet-v4/src'
import { SkeletonRectangle } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'

// Rates API is not the most accurate for COIN-FIAT pairs
// So fallback for targetFiat to our ticker API (FiatDisplay)
export class TargetFiatAmount extends React.PureComponent {
  render () {
    return this.props.targetAmount.cata({
      Success: value => (
        <FiatDisplay
          data-e2e='exchangeSummaryTargetFiatValue'
          coin={this.props.targetCoin}
          {...this.props}
        >
          {
            Exchange.convertCoinToCoin({
              value,
              coin: this.props.targetCoin
            }).value
          }
        </FiatDisplay>
      ),
      NotAsked: () => <SkeletonRectangle height='26px' width='40px' />,
      Loading: () => <SkeletonRectangle height='26px' width='40px' />,
      Failure: () => <SkeletonRectangle height='26px' width='40px' />
    })
  }
}

export default TargetFiatAmount
