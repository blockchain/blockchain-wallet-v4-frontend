import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToCurrency } from 'services/conversionService'
import { selectors } from 'data'

const CurrencyDisplay = (props) => {
  let conversion = convertToCurrency(props.amount, props.currency, props.rates).getOrElse('N/A')
  return (<span className={props.className}>{conversion}</span>)
}

CurrencyDisplay.propTypes = {
  amount: PropTypes.number.isRequired
}

let mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplay)
