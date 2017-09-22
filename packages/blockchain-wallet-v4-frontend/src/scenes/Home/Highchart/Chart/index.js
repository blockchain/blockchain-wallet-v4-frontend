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
  '1 day': 86400,
  '15 mins': 900,
  '1 hour': 3600,
  '5 days': 432000
}
const BTCSTART = 1282089600
const ETHSTART = 1438992000

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      data: this.fetchChartData('BTC', BTCSTART),
      selectedCoin: 'BTC',
      start: BTCSTART,
      interval: intervals.day
    }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
    this.fetchChartData = this.fetchChartData.bind(this)
  }

  selectCoin (coin) {
    if (this.state.selectedCoin !== coin) {
      this.fetchChartData(coin, this.state.start | BTCSTART)
    }
  }

  selectTimeframe (timeframe) {
    var start = this.state.start
    let date = new Date()
    switch (timeframe) {
      case 'year':
        start = date.setFullYear(date.getFullYear() - 1)
        break
      case 'month':
        start = date.setMonth(date.getMonth() - 1)
        break
      case 'week':
        start = date.setDate(date.getDate - 7)
        break
      case 'day':
        start = date.setDate(date.getDate - 1)
        break
      default: break
    }
    start = Math.round(start / 1000 | 0)
    this.fetchChartData(this.state.selectedCoin, start)
  }

  fetchChartData (coin, start) {
    console.log(`Start is ${start}`)
    const scale = scales['1 day']
    const { currency } = this.props
    api.getPriceIndexSeries(coin, currency, start, scale).then(
      data => this.setState({ data: data.map(o => [o.timestamp * 1000, o.price]), selectedCoin: coin, start: data[0].timestamp * 1000 }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    console.log('Rendering')

    return (
      <Chart
        selectTimeframe={this.selectTimeframe}
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
