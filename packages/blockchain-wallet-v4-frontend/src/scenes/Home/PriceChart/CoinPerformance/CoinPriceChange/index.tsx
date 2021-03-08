import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'

import { PriceChartPreferenceType } from 'data/preferences/types'
import { RootState } from 'data/rootReducer'
import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class CoinPriceChange extends PureComponent<Props> {
  state = {}

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      NotAsked: () => <Loading />,
      Loading: () => <Loading />,
      Failure: () => null
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  currency: FiatType
  priceChart: PriceChartPreferenceType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinPriceChange)
