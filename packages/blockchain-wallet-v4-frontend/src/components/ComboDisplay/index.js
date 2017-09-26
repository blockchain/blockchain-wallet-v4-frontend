import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin, convertBaseCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const CoinDisplay = props => {
  const { unit, currency, rates, children } = props

  return <div>{`${convertBaseCoinToCoin(unit, children)} (${convertBaseCoinToFiat(currency, rates, children)})`}</div>
}

CoinDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.btcRates.getBtcRates(state)
})

export default connect(mapStateToProps)(CoinDisplay)
