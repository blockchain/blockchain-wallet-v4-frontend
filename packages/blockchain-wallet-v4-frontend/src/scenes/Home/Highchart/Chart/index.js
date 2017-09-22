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

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      data: this.fetchChartData('BTC'),
      selectedCoin: 'BTC',
      start: 12307680,
      interval: intervals.day
    }
    this.selectCoin = this.selectCoin.bind(this)
  }

  selectCoin (coin) {
    this.fetchChartData(coin)
  }

  fetchChartData (coin) {
    const start = 12307680
    const scale = scales['1 day']
    const { currency } = this.props
    api.getPriceIndexSeries(coin, currency, start, scale).then(
      data => this.setState({ data: data.map(o => [o.timestamp * 1000, o.price]), selectedCoin: coin, start: data[0].timestamp }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    console.log('Rendering')

    return (
      <Chart
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
