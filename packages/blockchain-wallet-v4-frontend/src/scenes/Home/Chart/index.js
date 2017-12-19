import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { selectPriceIndexSeriesOptions } from 'services/ChartService'
import configure from './chart.config.js'
import { getChart } from './selectors'
import Chart from './template.js'
import Error from './template.error'
import Loading from './template.loading'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coin: 'BTC', timeframe: 'all' }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  componentWillMount () {
    const { coin, timeframe } = this.state
    const { start, scale } = selectPriceIndexSeriesOptions(coin, timeframe)
    this.props.dataMiscActions.fetchPriceIndexSeries(coin, start, scale)
    this.props.settingsActions.fetchSettings()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!equals(this.state.coin, nextState.coin) ||
        !equals(this.state.timeframe, nextState.timeframe)) {
      const { start, scale } = selectPriceIndexSeriesOptions(nextState.coin, nextState.timeframe)
      this.props.actions.fetchPriceIndexSeries(nextState.coin, start, scale)
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
    console.log(this.props)
    // const { chart } = this.props
    // const { priceIndexSeries, currency } = chart.value
    // const { coin, timeframe } = this.state
    // const { start, interval } = selectPriceIndexSeriesOptions(coin, timeframe)
    // const data = priceIndexSeries.map(o => [o.timestamp * 1000, o.price])
    // const config = configure(start, interval, currency, data)

    // return RemoteData.caseOf(chart.value, {
    //   Success: (value) => <Chart
    //     coin={coin}
    //     timeframe={timeframe}
    //     config={config}
    //     selectCoin={this.selectCoin}
    //     selectTimeframe={this.selectTimeframe}
    //   />,
    //   Failed: (message) => <Error>{message}</Error>,
    //   _: () => <Loading />
    // })
    return <div />
  }
}

const mapStateToProps = (state) => ({
  chart: getChart(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataMiscActions: bindActionCreators(actions.core.data.misc, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
