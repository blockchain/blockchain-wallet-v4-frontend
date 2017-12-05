import React from 'react'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { isBitcoinFiatAvailable } from 'services/ValidationHelper'
import BitcoinTicker from './template.js'

class BitcoinTickerContainer extends React.Component {
  render () {
    const { coin, country, currency, bitcoinRates, bitcoinOptions } = this.props
    const rate = Exchange.displayBitcoinToFiat({ value: '1', fromUnit: 'BTC', toCurrency: currency, rates: bitcoinRates })
    return isBitcoinFiatAvailable(country, currency, bitcoinRates, bitcoinOptions)
      ? <BitcoinTicker selected={coin === 'BTC'} {...this.props}>{rate}</BitcoinTicker>
      : <BitcoinTicker selected={coin === 'BTC'} {...this.props}>N/A</BitcoinTicker>
  }
}

const mapStateToProps = (state) => ({
  country: selectors.core.settings.getCountryCode(state),
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  bitcoinOptions: selectors.core.walletOptions.selectBitcoin(state)
})

export default connect(mapStateToProps)(BitcoinTickerContainer)
