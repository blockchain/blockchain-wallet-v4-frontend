import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { isBitcoinFiatAvailable, isEthereumFiatAvailable } from 'services/ValidationHelper'
import { selectors } from 'data'
import FiatDisplay from './template.js'

class FiatDisplayContainer extends React.Component {
  render () {
    const { coin, country, currency, bitcoinRates, ethereumRates, bitcoinOptions, ethereumOptions, children } = this.props

    switch (coin) {
      case 'BTC': {
        return isBitcoinFiatAvailable(country, currency, bitcoinRates, bitcoinOptions)
          ? <FiatDisplay {...this.props}>{Exchange.displayBitcoinToFiat({ value: children, fromUnit: 'SAT', toCurrency: currency, rates: bitcoinRates })}</FiatDisplay>
          : <FiatDisplay {...this.props}>N/A</FiatDisplay>
      }
      case 'ETH': {
        return isEthereumFiatAvailable(country, currency, ethereumRates, ethereumOptions)
          ? <FiatDisplay {...this.props}>{Exchange.displayEtherToFiat({ value: children, fromUnit: 'WEI', toCurrency: currency, rates: ethereumRates })}</FiatDisplay>
          : <FiatDisplay {...this.props}>N/A</FiatDisplay>
      }
    }
  }
}

FiatDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  country: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  bitcoinRates: PropTypes.object.isRequired,
  ethereumRates: PropTypes.object.isRequired,
  bitcoinOptions: PropTypes.object.isRequired,
  ethereumOptions: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  country: selectors.core.settings.getCountryCode(state),
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state),
  bitcoinOptions: selectors.core.walletOptions.selectBitcoin(state),
  ethereumOptions: selectors.core.walletOptions.selectEthereum(state)
})

export default connect(mapStateToProps)(FiatDisplayContainer)
