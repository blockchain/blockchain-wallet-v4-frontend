import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToUnit, displayCoin } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, ...rest } = props
  const coin = convertToUnit(network, children, unit).getOrElse({})
  const amount = displayCoin(network, coin.amount, coin.symbol).getOrElse('N/A')

  return <Typography {...rest}>{amount}</Typography>
}

CoinDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  network: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(CoinDisplay)
