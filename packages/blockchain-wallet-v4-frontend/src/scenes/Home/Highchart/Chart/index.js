import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { api } from 'services/ApiService'

import Chart from './template.js'

const intervals = {
  hour: 3600 * 1000,
  day: 24 * 3600 * 1000
}

const scales = {
  FIFTEENMIN: 900,
  HOUR: 3600,
  TWOHOUR: 7200,
  DAY: 86400,
  FIVEDAY: 432000
}
const BTCSTART = 1282089600
const ETHSTART = 1438992000

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      data: this.fetchChartData('BTC', 'all', BTCSTART, scales.FIVEDAY),
      selectedCoin: 'BTC',
      selectedTimeframe: 'all',
      start: BTCSTART,
      interval: intervals.day,
      scale: scales.FIVEDAY
    }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
    this.fetchChartData = this.fetchChartData.bind(this)
  }

  selectCoin (coin) {
    if (this.state.selectedCoin !== coin) {
      const { selectedTimeframe, start, scale } = this.state
      this.fetchChartData(coin, selectedTimeframe, start, scale)
    }
  }

  selectTimeframe (timeframe) {
    if (timeframe !== this.state.selectedTimeframe) {
      let { start, scale } = this.state
      let date = new Date()
      switch (timeframe) {
        case 'all':
          start = this.state.selectedCoin === 'BTC' ? BTCSTART : ETHSTART
          scale = scales.FIVEDAY
          break
        case 'year':
          start = date.setFullYear(date.getFullYear() - 1)
          scale = scales.DAY
          break
        case 'month':
          start = date.setMonth(date.getMonth() - 1)
          scale = scales.TWOHOUR
          break
        case 'week':
          start = date.setDate(date.getDate() - 7)
          scale = scales.HOUR
          this.setState({ interval: intervals.hour })
          break
        case 'day':
          start = date.setDate(date.getDate() - 1)
          scale = scales.FIFTEENMIN
          this.setState({ interval: intervals.hour })
          break
        default: break
      }
      start = Math.round(start / 1000 | 0)
      this.fetchChartData(this.state.selectedCoin, timeframe, start, scale)
    }
  }

  fetchChartData (coin, timeframe, start, scale) {
    const { currency } = this.props
    api.getPriceIndexSeries(coin, currency, start, scale).then(
      data => this.setState({ data: data.map(o => [o.timestamp * 1000, o.price]), selectedCoin: coin, selectedTimeframe: timeframe, start: start, scale: scale }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    return (
      <Chart
        selectTimeframe={this.selectTimeframe}
        selectedTimeframe={this.state.selectedTimeframe}
        selectCoin={this.selectCoin}
        selectedCoin={this.state.selectedCoin}
        currency={this.props.currency}
        data={this.state.data}
        start={this.state.start}
        interval={this.state.interval} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state)
})

export default connect(mapStateToProps)(ChartContainer)
