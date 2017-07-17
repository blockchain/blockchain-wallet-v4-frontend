import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToUnit, convertCoinToFiat } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, currency, rates, ...rest } = props
  const fiat = convertCoinToFiat(network, children, currency, rates).getOrElse({ amount: 'N/A' })
  const crypto = convertToUnit(network, children, unit).getOrElse({ amount: 'N/A', symbol: '' })

  return <Typography {...rest}>{`${crypto.amount.toFixed(8)} ${crypto.symbol} (${fiat.symbol} ${fiat.amount.toFixed(2)})`}</Typography>
}

CoinDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state),
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CoinDisplay)
