import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin } from 'services/ConversionService'
import { selectors } from 'data'

const CoinDisplay = props => {
  const { unit, children } = props
  const amount = children.toString()

  return <div>{convertBaseCoinToCoin(unit, amount)}</div>
}

CoinDisplay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

CoinDisplay.defaultProps = {
  children: '0'
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(CoinDisplay)
