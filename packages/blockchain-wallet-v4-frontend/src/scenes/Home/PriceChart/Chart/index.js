import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { pathOr, toUpper } from 'ramda'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class ChartContainer extends React.PureComponent {
  componentDidMount () {
    const coin = pathOr('BTC', ['cache', 'coin'], this.props)
    const time = pathOr('1month', ['cache', 'time'], this.props)
    this.props.priceChartActions.initialized(toUpper(coin), time)
  }

  render () {
    const { currencySymbol, isSilverOrAbove } = this.props

    return this.props.data.cata({
      Success: value => (
        <Success
          currency={currencySymbol}
          coin={value.coin}
          time={value.time}
          data={value.data}
          isSilverOrAbove={isSilverOrAbove}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartContainer)
