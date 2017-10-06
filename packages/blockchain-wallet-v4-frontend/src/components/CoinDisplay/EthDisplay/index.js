import React from 'react'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin } from 'services/ConversionService'
import { selectors } from 'data'

const EthDisplay = props => {
  const { amount, unit } = props
  return <div>{convertBaseCoinToCoin('ETH', unit, amount)}</div>
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getEthUnit(state) || 'ETH'
})

export default connect(mapStateToProps)(EthDisplay)
