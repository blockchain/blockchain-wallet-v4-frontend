import React from 'react'
import {connect} from 'react-redux'

const BitcoinDisplay = ({amount, ...rest}) => {
  let convertedAmount = amount

  switch (rest.unit) {
    case 'mBTC':
      convertedAmount = parseFloat((amount * 1000).toFixed(5))
      break
    case 'bits':
      convertedAmount = parseFloat((amount * 1000000).toFixed(2))
      break
    default: convertedAmount = amount
  }

  return (
    <span {...rest}>{`${convertedAmount} ${rest.unit}`}</span>
  )
}

function mapStateToProps (state) {
  return {
    unit: 'bits'
  }
}

export default connect(mapStateToProps)(BitcoinDisplay)
