import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'

const CurrencyDisplay = props => {
  const { currency, rates, children } = props

  return (<div>{convertBaseCoinToFiat(currency, rates, children)}</div>)
}

CurrencyDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.btcRates.getBtcRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
