import React from 'react'
import { connect } from 'react-redux'

import { convertBaseCoinToCoin } from 'services/ConversionService'
import { selectors } from 'data'

const BtcDisplay = props => {
  const { amount, unit } = props
  return <div>{convertBaseCoinToCoin('BTC', unit, amount)}</div>
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcUnit(state) || 'BTC'
})

export default connect(mapStateToProps)(BtcDisplay)
