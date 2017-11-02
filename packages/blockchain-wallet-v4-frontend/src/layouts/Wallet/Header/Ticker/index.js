import React from 'react'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'

import { selectors } from 'data'
import Ticker from './template.js'

class TickerContainer extends React.Component {
  render () {
    const { currency, bitcoinRates, ethereumRates } = this.props
    const bitcoinRate = Exchange.displayBitcoinToFiat({ value: '1', fromUnit: 'BTC', toCurrency: currency, rates: bitcoinRates })
    const ethereumRate = Exchange.displayEtherToFiat({ value: '1', fromUnit: 'ETH', toCurrency: currency, rates: ethereumRates })
    return <Ticker bitcoinRate={bitcoinRate} ethereumRate={ethereumRate} />
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state)
})

export default connect(mapStateToProps)(TickerContainer)
