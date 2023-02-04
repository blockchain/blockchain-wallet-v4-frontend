import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType, ExtractSuccess } from '@core/types'
import { actions } from 'data'

import { LoadingBalance } from '../../model'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'

class Balance extends React.PureComponent<Props> {
  handleRefresh = () => {
    this.props.coinsActions.fetchUnifiedBalances()
  }

  render() {
    const { coin, coinTicker, data, large } = this.props

    return data.cata({
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coinTicker={coinTicker} />,
      NotAsked: () => <LoadingBalance large={large} coinTicker={coinTicker} />,
      Success: (value) => (
        // @ts-ignore
        <Success
          {...this.props}
          balance={value}
          large={large}
          coin={coin}
          coinTicker={coinTicker}
        />
      )
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  coinTicker: string
  large: boolean
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Balance)
