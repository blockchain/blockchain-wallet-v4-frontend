import React from 'react'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import EthereumTicker from './template.js'

class EthereumTickerContainer extends React.Component {
  render () {
    const { currency, ethereumRates } = this.props
    const rate = Exchange.displayEtherToFiat({ value: '1', fromUnit: 'ETH', toCurrency: currency, rates: ethereumRates })

    return <EthereumTicker rate={rate} />
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state)
})

export default connect(mapStateToProps)(EthereumTickerContainer)
