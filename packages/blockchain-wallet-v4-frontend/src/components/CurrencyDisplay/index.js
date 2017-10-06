import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const CurrencyDisplay = props => {
  const { currency, rates, children } = props
  const amount = children || '0'

  return (<div>{convertBaseCoinToFiat(currency, rates, amount)}</div>)
}

CurrencyDisplay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.btcRates.getBtcRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
