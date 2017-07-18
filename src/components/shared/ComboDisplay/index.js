import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToUnit, convertCoinToFiat, displayCoin, displayFiat } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, currency, rates, ...rest } = props
  const fiat = convertCoinToFiat(network, children, currency, rates).getOrElse({})
  const coin = convertToUnit(network, children, unit).getOrElse({})

  const coinAmount = displayCoin(network, coin.amount, coin.symbol).getOrElse('N/A')
  const fiatAmount = displayFiat(fiat.amount, fiat.symbol).getOrElse('N/A')

  return <Typography {...rest}>{`${coinAmount} (${fiatAmount})`}</Typography>
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
