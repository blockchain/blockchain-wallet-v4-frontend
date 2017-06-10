import React from 'react'
import {connect} from 'react-redux'
import { core } from 'data/rootSelectors'

const BitcoinDisplay = (props) => {
  let convertedAmount = 0
  let unitDisplay = ''

  switch (props.unit) {
    case 'MBC': // TODO: µBTC
      convertedAmount = parseFloat(props.amount.toFixed(2))
      unitDisplay = 'mBTC'
      break
    case 'UBC':
      convertedAmount = parseFloat((props.amount / 1000).toFixed(2))
      unitDisplay = 'µBTC'
      break
    case 'BTC':
      convertedAmount = parseFloat((props.amount / 1000000).toFixed(8))
      unitDisplay = 'BTC'
      break
  }
  return (
    <span className={props.className}>{`${convertedAmount} ${unitDisplay}`}</span>
  )
}

function mapStateToProps (state) {
  return {
    unit: core.settings.getBtcCurrency(state)
  }
}

export default connect(mapStateToProps)(BitcoinDisplay)
