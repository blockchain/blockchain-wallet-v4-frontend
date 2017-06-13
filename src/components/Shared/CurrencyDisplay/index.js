import React from 'react'
import {connect} from 'react-redux'
import { path } from 'ramda'

import { selectors } from 'data'

const CurrencyDisplay = (props) => {
  let ratio = path([props.currency, 'last'], props.rates)
  let convertedAmount = parseFloat((props.amount * ratio / 100000000).toFixed(2))
  return (
    <span className={props.className}>{`${convertedAmount} ${props.currency}`}</span>
  )
}

function mapStateToProps (state) {
  return {
    currency: selectors.core.settings.getCurrency(state),
    rates: selectors.core.rates.getRates(state)
  }
}

export default connect(mapStateToProps)(CurrencyDisplay)
