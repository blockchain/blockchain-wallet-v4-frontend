import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { api } from 'services/ApiService'
import { displayFiat, coinScale } from 'services/ConversionService'

import Chart from './template.js'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: [] }
  }

  componentWillMount () {
    api.getPriceIndexSeries('btc', this.props.currency, 12307680, 3600 * 24).then(
      data => this.setState({ data: data.map(o => [o.timestamp, o.price]) }),
      message => this.props.alertActions.displayError(message)
    )
  }

  render () {
    const { network, currency, btcRates, ethRates } = this.props
    const btcAmount = coinScale('bitcoin')
    const btcCoin = `1 BTC`
    const ethCoin = `  1 ETH`
    const btcRate = displayFiat(network, btcAmount, currency, btcRates).getOrElse('N/A')
    const ethRate = displayFiat(network, btcAmount, currency, ethRates).getOrElse('N/A')

    return (
      <Chart
        currency={this.props.currency}
        data={this.state.data}
        btcCoin={btcCoin}
        ethCoin={ethCoin}
        btcRate={btcRate}
        ethRate={ethRate} />
    )
  }
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  currency: selectors.core.settings.getCurrency(state),
  btcRates: selectors.core.btcRates.getBtcRates(state),
  ethRates: selectors.core.ethRates.getEthRates(state)
})

export default connect(mapStateToProps)(ChartContainer)
