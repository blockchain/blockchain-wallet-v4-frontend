import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import { selectPriceIndexSeriesOptions } from 'services/ChartService'
import configure from './chart.config.js'
import Chart from './template.js'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coin: 'BTC', timeframe: 'all' }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  componentWillMount () {
    this.props.actions.initChart(this.state.coin, this.state.timeframe)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!equals(this.state.coin, nextState.coin) ||
        !equals(this.state.timeframe, nextState.timeframe)) {
      this.props.actions.refreshChart(nextState.coin, nextState.timeframe)
    }

    return !equals(this.props.chart, nextProps.chart) ||
           !equals(this.state.coin, nextState.coin) ||
           !equals(this.state.timeframe, nextState.timeframe)
  }

  selectCoin (value) {
    this.setState({ coin: value })
  }

  selectTimeframe (value) {
    this.setState({ timeframe: value })
  }

  render () {
    const { priceIndexSeries, currency } = this.props.chart
    const { coin, timeframe } = this.state
    const { start, interval } = selectPriceIndexSeriesOptions(coin, timeframe)
    const data = priceIndexSeries.map(o => [o.timestamp * 1000, o.price])
    const config = configure(start, interval, currency, data)

    return <Chart
      coin={coin}
      timeframe={timeframe}
      config={config}
      selectCoin={this.selectCoin}
      selectTimeframe={this.selectTimeframe}
    />
  }
}

const mapStateToProps = (state) => ({
  chart: selectors.modules.chart.getChart(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.chart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
