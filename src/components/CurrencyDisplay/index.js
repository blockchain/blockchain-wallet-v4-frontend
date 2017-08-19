import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { displayFiat } from 'services/ConversionService'
import { selectors } from 'data'

const CurrencyDisplay = ({ ...props, children }) => {
  const { network, currency, rates } = props
  const fiat = displayFiat(network, children, currency, rates).getOrElse('N/A')

  return (
    <div>{fiat}</div>)
}

CurrencyDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CurrencyDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
