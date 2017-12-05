import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

import CoinDisplay from './template.js'

class CoinDisplayContainer extends React.Component {
  render () {
    const { coin, unit, children } = this.props

    switch (coin) {
      case 'BTC': return <CoinDisplay {...this.props}>{Exchange.displayBitcoinToBitcoin({ value: children, fromUnit: 'SAT', toUnit: unit })}</CoinDisplay>
      case 'ETH': return <CoinDisplay {...this.props}>{Exchange.displayEtherToEther({ value: children, fromUnit: 'WEI', toUnit: 'ETH' })}</CoinDisplay>
      default: return <div />
    }
  }
}

CoinDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  country: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  country: selectors.core.settings.getCountryCode(state),
  unit: selectors.core.settings.getBtcUnit(state)
})

export default connect(mapStateToProps)(CoinDisplayContainer)
