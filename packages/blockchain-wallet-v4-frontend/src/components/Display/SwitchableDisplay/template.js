import React from 'react'
import PropTypes from 'prop-types'

import CoinDisplay from '../CoinDisplay'
import FiatDisplay from '../FiatDisplay'

const SwitchableDisplay = props => {
  const { coinDisplayed, children, ...rest } = props

  return coinDisplayed ? (
    <CoinDisplay {...rest}>{children}</CoinDisplay>
  ) : (
    <FiatDisplay {...rest}>{children}</FiatDisplay>
  )
}

SwitchableDisplay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coinDisplayed: PropTypes.bool.isRequired
}

export default SwitchableDisplay
