import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToUnit } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { coin, unit, ...rest } = props
  let crypto = convertToUnit(coin, children, unit).getOrElse({ amount: 'N/A', symbol: '' })

  return <Typography {...rest}>{`${crypto.amount} ${crypto.symbol}`}</Typography>
}

CoinDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  coin: 'bitcoin',
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(CoinDisplay)
