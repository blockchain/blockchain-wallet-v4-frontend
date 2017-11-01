import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const ComboDisplay = props => {
  const { coin, unit, currency, bitcoinRates, ethereumRates, children } = props
  const result = coin === 'BTC'
    ? `${Exchange.displayBitcoinToBitcoin({ value: children, fromUnit: 'SAT', toUnit: unit })} 
       ${Exchange.displayBitcoinToFiat({ value: children, fromUnit: 'SAT', toCurrency: currency, bitcoinRates })}`
    : `${Exchange.displayEtherToEther({ value: children, fromUnit: 'WEI', toUnit: 'ETH' })} 
       ${Exchange.displayEtherToFiat({ value: children, fromUnit: 'WEI', toCurrency: currency, ethereumRates })}`

  return <div>{result}</div>
}

ComboDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

ComboDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state),
  currency: selectors.core.settings.getCurrency(state),
  bticoinRates: selectors.core.data.bitcoin.getRates(state),
  ethereumRates: selectors.core.data.bitcoin.getRates(state)
})

export default connect(mapStateToProps)(ComboDisplay)
