import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToBitcoin } from 'services/conversionService'
import { selectors } from 'data'
import BitcoinDisplay from './template.js'

const BitcoinDisplayContainer = (props) => {
  let conversion = convertToBitcoin(props.amount, props.unit).getOrElse('N/A')

  return (
    <BitcoinDisplay className={props.className} value={conversion} />
  )
}

BitcoinDisplayContainer.propTypes = {
  amount: PropTypes.number.isRequired
}

BitcoinDisplayContainer.defaultProps = {
  amount: 0
}

function mapStateToProps (state) {
  return {
    unit: selectors.core.settings.getBtcCurrency(state)
  }
}

export default connect(mapStateToProps)(BitcoinDisplayContainer)
