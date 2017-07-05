import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToBitcoin } from 'services/ConversionService'
import { selectors } from 'data'

const BitcoinDisplay = (props) => {
  let conversion = convertToBitcoin(props.amount, props.unit).getOrElse('N/A')
  return (<span className={props.className}>{conversion}</span>)
}

BitcoinDisplay.propTypes = {
  amount: PropTypes.number.isRequired
}

BitcoinDisplay.defaultProps = {
  amount: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(BitcoinDisplay)
