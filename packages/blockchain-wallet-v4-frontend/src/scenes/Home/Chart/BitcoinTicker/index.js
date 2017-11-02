import React from 'react'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import BitcoinTicker from './template.js'

class BitcoinTickerContainer extends React.Component {
  render () {
    const { coin, currency, bitcoinRates } = this.props
    const rate = Exchange.displayBitcoinToFiat({ value: '1', fromUnit: 'BTC', toCurrency: currency, rates: bitcoinRates })

    return <BitcoinTicker rate={rate} selected={coin === 'BTC'} {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state)
})

export default connect(mapStateToProps)(BitcoinTickerContainer)
