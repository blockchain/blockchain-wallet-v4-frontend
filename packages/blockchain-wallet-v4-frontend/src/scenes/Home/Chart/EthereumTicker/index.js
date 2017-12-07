import React from 'react'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { isEthereumFiatAvailable } from 'services/ValidationHelper'
import EthereumTicker from './template.js'

class EthereumTickerContainer extends React.Component {
  render () {
    const { coin, country, currency, ethereumRates, ethereumOptions } = this.props
    const rate = Exchange.displayEtherToFiat({ value: '1', fromUnit: 'ETH', toCurrency: currency, rates: ethereumRates })
    return isEthereumFiatAvailable(country, currency, ethereumRates, ethereumOptions)
      ? <EthereumTicker selected={coin === 'ETH'} {...this.props}>{rate}</EthereumTicker>
      : <EthereumTicker selected={coin === 'ETH'} {...this.props}>N/A</EthereumTicker>
  }
}

const mapStateToProps = (state) => ({
  country: selectors.core.settings.getCountryCode(state),
  currency: selectors.core.settings.getCurrency(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state),
  ethereumOptions: selectors.core.walletOptions.selectEthereum(state)
})

export default connect(mapStateToProps)(EthereumTickerContainer)
