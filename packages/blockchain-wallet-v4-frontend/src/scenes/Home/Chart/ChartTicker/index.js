import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { displayFiat, coinScale } from 'services/ConversionService'
import ChartTicker from './template.js'

class ChartTickerContainer extends React.Component {
  render () {
    const { coin, selectedCoin, network, btcRates, ethRates } = this.props
    const btcAmount = coinScale('bitcoin')
    const rates = coin === 'BTC' ? btcRates : ethRates
    const rate = displayFiat(network, btcAmount, this.props.currency, rates).getOrElse('N/A')
    return (
      <ChartTicker
        coin={coin}
        rate={rate}
        selectedCoin={selectedCoin} />
    )
  }
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  currency: selectors.core.settings.getCurrency(state),
  btcRates: selectors.core.btcRates.getBtcRates(state),
  ethRates: selectors.core.ethRates.getEthRates(state)
})

export default connect(mapStateToProps)(ChartTickerContainer)
