import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { displayCoin, displayFiat } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, currency, rates, ...rest } = props
  const coin = displayCoin(network, children, unit).getOrElse('N/A')
  const fiat = displayFiat(network, children, currency, rates).getOrElse('N/A')

  return <Typography {...rest}>{`${coin} (${fiat})`}</Typography>
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
