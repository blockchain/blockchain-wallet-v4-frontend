import React from 'react'
import {connect} from 'react-redux'

import { selectors } from 'data'

const BitcoinDisplay = (props) => {
  let convertedAmount = 0
  let unitDisplay = ''
  switch (props.unit) {
    case 'UBC':
      convertedAmount = parseFloat((props.amount / 100).toFixed(2))
      unitDisplay = 'bits'
      break
    case 'MBC':
      convertedAmount = parseFloat((props.amount / 100000).toFixed(5))
      unitDisplay = 'mBTC'
      break
    case 'BTC':
      convertedAmount = parseFloat((props.amount / 100000000).toFixed(8))
      unitDisplay = 'BTC'
      break
  }
  return (
    <span className={props.className}>{`${convertedAmount} ${unitDisplay}`}</span>
  )
}

function mapStateToProps (state) {
  return {
    unit: selectors.core.settings.getBtcCurrency(state)
  }
}

export default connect(mapStateToProps)(BitcoinDisplay)
