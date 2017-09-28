import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin, convertBaseCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const ComboDisplay = props => {
  const { unit, currency, rates, children } = props
  return <div>{`${convertBaseCoinToCoin(unit, children)} (${convertBaseCoinToFiat(currency, rates, children)})`}</div>
}

ComboDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

ComboDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.btcRates.getBtcRates(state)
})

export default connect(mapStateToProps)(ComboDisplay)
