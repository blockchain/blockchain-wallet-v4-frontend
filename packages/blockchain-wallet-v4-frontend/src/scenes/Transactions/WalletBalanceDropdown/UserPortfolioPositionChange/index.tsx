import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, ExtractSuccess, FiatType } from 'core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getData } from './selectors'
import { PriceChange } from '../../model'
import { SkeletonRectangle } from 'blockchain-info-components'
import BigNumber from 'bignumber.js'

class UserPortfolioPositionChange extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.miscActions.fetchPriceChange(
      this.props.coin,
      this.props.currency,
      'day',
      convertBaseToStandard(this.props.coin, this.props.coinBalance)
    )
  }

  componentDidUpdate (prevProps: Props) {
    if (!prevProps.coinBalance.isEqualTo(this.props.coinBalance)) {
      this.props.miscActions.fetchPriceChange(
        this.props.coin,
        this.props.currency,
        'day',
        convertBaseToStandard(this.props.coin, this.props.coinBalance)
      )
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <PriceChange
          priceChange={{
            ...val.priceChange,
            diff: val.priceChange.positionChange.diff,
            percentChange: val.priceChange.positionChange.percentChange,
            movement: val.priceChange.positionChange.movement
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
      Failure: () => null,
      Loading: () => <SkeletonRectangle height='20px' width='40px' />,
      NotAsked: () => <SkeletonRectangle height='20px' width='40px' />
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
