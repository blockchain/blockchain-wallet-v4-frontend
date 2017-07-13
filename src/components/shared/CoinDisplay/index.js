import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertToBitcoin } from 'services/ConversionService'
import { selectors } from 'data'
import { Typography } from 'components/generic/Typography'

const CoinDisplay = ({ ...props, children }) => {
  const { unit, ...rest } = props
  let conversion = convertToBitcoin(children, unit).getOrElse('N/A')

  return <Typography {...rest}>{conversion}</Typography>
}

CoinDisplay.propTypes = {
  children: PropTypes.number.isRequired
}

CoinDisplay.defaultProps = {
  children: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(CoinDisplay)
