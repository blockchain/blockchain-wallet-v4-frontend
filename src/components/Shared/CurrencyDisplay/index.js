import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToCurrency } from 'services/conversionService'
import { selectors } from 'data'
import CurrencyDisplay from './template.js'

const CurrencyDisplayContainer = (props) => {
  let conversion = convertToCurrency(props.amount, props.currency, props.rates).getOrElse('N/A')

  return (
    <CurrencyDisplay className={props.className} value={conversion} />
  )
}

CurrencyDisplayContainer.propTypes = {
  amount: PropTypes.number.isRequired
}

function mapStateToProps (state) {
  return {
    currency: selectors.core.settings.getCurrency(state),
    rates: selectors.core.rates.getRates(state)
  }
}

export default connect(mapStateToProps)(CurrencyDisplayContainer)
