import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CurrencyDisplay = ({ ...props, children }) => {
  const { coin, currency, rates, ...rest } = props
  const fiat = convertCoinToFiat(coin, children, currency, rates).getOrElse({ amount: 'N/A' })

  return (
    <Typography {...rest}>{`${fiat.symbol} ${fiat.amount}`}</Typography>)
}

CurrencyDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CurrencyDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  coin: 'bitcoin',
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
