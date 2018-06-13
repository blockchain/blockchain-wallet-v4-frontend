import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { path, toUpper } from 'ramda'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class ChartContainer extends React.PureComponent {
  componentDidMount () {
    const coin = path(['cache', 'coin'], this.props) ? toUpper(this.props.cache.coin) : 'BTC'
    const time = path(['cache', 'time'], this.props) || '1month'
    this.props.priceChartActions.initialized(coin, time)
  }

  render () {
    const { currencySymbol } = this.props

    return this.props.data.cata({
      Success: value => <Success currency={currencySymbol} coin={value.coin} time={value.time} data={value.data} />,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
