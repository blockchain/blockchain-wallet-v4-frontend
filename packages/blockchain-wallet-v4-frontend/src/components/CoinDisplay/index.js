import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const CoinDisplay = props => {
  const { coin, unit, children } = props

  const result = coin === 'BTC'
    ? Exchange.displayBitcoinToBitcoin({ value: children, fromUnit: 'SAT', toUnit: unit })
    : Exchange.displayEtherToEther({ value: children, fromUnit: 'WEI', toUnit: 'ETH' })

  return <div>{result}</div>
}

CoinDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state)
})

export default connect(mapStateToProps)(CoinDisplay)
