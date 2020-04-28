import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { CoinType, FiatType, RemoteDataType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { pathOr, toUpper } from 'ramda'
import Error from './template.error'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

export class ChartContainer extends React.PureComponent<Props> {
  componentDidMount () {
    const coin = pathOr('BTC', ['cache', 'coin'], this.props)
    const time = pathOr('1month', ['cache', 'time'], this.props)
    this.props.priceChartActions.initialized(toUpper(coin), time)
  }

  render () {
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

const mapStateToProps = (state): LinkStatePropsType => getData(state)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type SuccessStateType = {
  coin: CoinType
  data: Array<any>
  time: string
}

type LinkStatePropsType = {
  currency: FiatType
  currencySymbol: string
  data: RemoteDataType<string, SuccessStateType>
}

type Props = ConnectedProps<typeof connector>

export default connector(ChartContainer)
