import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { displayCoin } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, ...rest } = props
  console.log(network, children, unit)
  const coin = displayCoin(network, children, unit).getOrElse('N/A')
  console.log(coin)

  return <Typography {...rest}>{coin}</Typography>
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
