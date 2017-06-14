import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToBitcoin } from 'services/conversionService'
import { selectors } from 'data'
import BitcoinDisplay from './template.js'

const BitcoinDisplayContainer = (props) => {
  let conversion = convertToBitcoin(props.amount, props.unit)

  return (
    <BitcoinDisplay className={props.className} value={conversion.success ? conversion.value : 'N/A'} />
  )
}

BitcoinDisplayContainer.propTypes = {
  amount: PropTypes.number.isRequired
}

function mapStateToProps (state) {
  return {
    unit: selectors.core.settings.getBtcCurrency(state)
  }
}

export default connect(mapStateToProps)(BitcoinDisplayContainer)
