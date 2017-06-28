import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import { convertToCurrency } from 'services/conversionService'
import { selectors } from 'data'

export const CurrencyDisplay = ({ className, value }) => (
  <span className={className}>{value}</span>
)

CurrencyDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  element: PropTypes.string
}

const CurrencyDisplayContainer = (props) => {
  let conversion = convertToCurrency(props.amount, props.currency, props.rates).getOrElse('N/A')
  return (<CurrencyDisplay className={props.className} value={conversion} />)
}

CurrencyDisplayContainer.propTypes = {
  amount: PropTypes.number.isRequired
}

let mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  rates: selectors.core.rates.getRates(state)
})

export default connect(mapStateToProps)(CurrencyDisplayContainer)
