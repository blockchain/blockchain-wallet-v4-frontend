import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToCurrency } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CurrencyDisplay = ({ ...props, children }) => {
  const { currency, rates, ...rest } = props
  let conversion = convertToCurrency(children, currency, rates).getOrElse('N/A')

  return (
    <Typography {...rest}>{conversion}</Typography>)
}

CurrencyDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CurrencyDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
