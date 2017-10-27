import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { convertBaseCoinToCoin } from 'services/ConversionService'
import { selectors } from 'data'

const CoinDisplay = props => {
  const { coin, unit, children } = props
  const amount = children || '0'
  const from = coin
  const to = coin === 'BTC' ? unit : 'ETH'
  return <div>{convertBaseCoinToCoin(from, to, amount)}</div>
}

CoinDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state) || 'BTC'
})

export default connect(mapStateToProps)(CoinDisplay)
