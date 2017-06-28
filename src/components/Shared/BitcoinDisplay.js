import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToBitcoin } from 'services/conversionService'
import { selectors } from 'data'

const BitcoinDisplay = ({ className, value }) => (
  <span className={className}>{value}</span>
)

BitcoinDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

const BitcoinDisplayContainer = (props) => {
  let conversion = convertToBitcoin(props.amount, props.unit).getOrElse('N/A')
  return (<BitcoinDisplay className={props.className} value={conversion} />)
}

BitcoinDisplayContainer.propTypes = {
  amount: PropTypes.number.isRequired
}

BitcoinDisplayContainer.defaultProps = {
  amount: 0
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

export default connect(mapStateToProps)(BitcoinDisplayContainer)
