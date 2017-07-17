import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToUnit } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { network, unit, ...rest } = props
  let crypto = convertToUnit(network, children, unit).getOrElse({ amount: 'N/A', symbol: '' })

  return <Typography {...rest}>{`${crypto.amount} ${crypto.symbol}`}</Typography>
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
