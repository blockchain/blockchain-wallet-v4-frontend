import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin, convertBaseCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const ComboDisplay = props => {
  const { unit, currency, rates, children } = props
  const amount = children || '0'

  return <div>{`${convertBaseCoinToCoin('BTC', unit, amount)} (${convertBaseCoinToFiat(currency, rates, amount)})`}</div>
}

ComboDisplay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

ComboDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getBtcRates(state)
})

export default connect(mapStateToProps)(ComboDisplay)
