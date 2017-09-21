import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { api } from 'services/ApiService'

import Chart from './template.js'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      data: this.fetchChartData('BTC'),
      selectedCoin: 'BTC'
    }
    this.selectCoin = this.selectCoin.bind(this)
  }

  selectCoin (coin) {
    this.fetchChartData(coin)
  }

  fetchChartData (coin) {
    const start = 12307680
    const scale = 3600 * 24
    const { currency } = this.props
    api.getPriceIndexSeries(coin, currency, start, scale).then(
      data => this.setState({ data: data.map(o => [o.timestamp, o.price]), selectedCoin: coin }),
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
        data={this.state.data} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state)
})

export default connect(mapStateToProps)(ChartContainer)
