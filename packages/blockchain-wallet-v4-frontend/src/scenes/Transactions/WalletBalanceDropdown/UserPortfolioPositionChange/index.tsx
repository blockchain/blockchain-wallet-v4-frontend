import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { bindActionCreators, Dispatch } from 'redux'

import { SkeletonRectangle } from 'blockchain-info-components'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  TimeRange
} from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

import { PriceChange } from '../../model'
import { getData } from './selectors'

class UserPortfolioPositionChange extends PureComponent<Props> {
  state = {}

  componentDidMount() {
    this.props.miscActions.fetchPriceChange(
      this.props.coin,
      this.props.currency,
      TimeRange.DAY,
      convertBaseToStandard(this.props.coin, this.props.coinBalance)
    )
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.coinBalance.isEqualTo(this.props.coinBalance)) {
      this.props.miscActions.fetchPriceChange(
        this.props.coin,
        this.props.currency,
        TimeRange.DAY,
        convertBaseToStandard(this.props.coin, this.props.coinBalance)
      )
    }
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <PriceChange
          isPortfolioPosition
          priceChange={{
            ...val.priceChange
          }}
          {...this.props}
        >
          {' '}
          <FormattedMessage
            id='scenes.transactions.performance.prices.day'
            defaultMessage='today'
          />
        </PriceChange>
      ),
      Failure: () => (
        <SkeletonRectangle height='17px' width='40px' bgColor={'red400'} />
      ),
      Loading: () => <SkeletonRectangle height='17px' width='40px' />,
      NotAsked: () => <SkeletonRectangle height='17px' width='40px' />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  coinBalance: BigNumber
  currency: FiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UserPortfolioPositionChange)
