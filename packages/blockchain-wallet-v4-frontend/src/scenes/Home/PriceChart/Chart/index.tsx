import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { pathOr, toUpper } from 'ramda'
import { bindActionCreators } from 'redux'

import { PriceChangeTimeRangeType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class ChartContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const coin = pathOr('BTC', ['cache', 'coin'], this.props)
    const time = pathOr(
      'month',
      ['cache', 'time'],
      this.props
    ) as PriceChangeTimeRangeType
    this.props.priceChartActions.initialized(toUpper(coin), time)
  }

  render() {
    return this.props.data.cata({
      Success: value => (
        <Success
          currency={this.props.currency}
          coin={value.coin}
          time={value.time}
          data={value.data}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

// @ts-ignore
const mapStateToProps = (state): LinkStatePropsType => getData(state)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ChartContainer)
