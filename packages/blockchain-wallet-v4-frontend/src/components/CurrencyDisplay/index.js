import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const CurrencyDisplay = props => {
  const { coin, currency, bitcoinRates, ethereumRates, unit, children } = props
  const result = coin === 'BTC'
    ? Exchange.displayBitcoinToFiat({ value: children, fromUnit: unit || 'SAT', toCurrency: currency, rates: bitcoinRates })
    : Exchange.displayEtherToFiat({ value: children, fromUnit: unit || 'WEI', toCurrency: currency, rates: ethereumRates })

  return <div>{result}</div>
}

CurrencyDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CurrencyDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.ethereum.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
