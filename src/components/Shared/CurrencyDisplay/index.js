import React from 'react'
import {connect} from 'react-redux'
import { path } from 'ramda'
import { core } from 'data/rootSelectors'

const CurrencyDisplay = (props) => {
  let ratio = path([props.currency, 'last'], props.rates)
  let convertedAmount = parseFloat((props.amount * ratio / 100000000).toFixed(2))
  return (
    <span className={props.className}>{`${convertedAmount} ${props.currency}`}</span>
  )
}

function mapStateToProps (state) {
  return {
    currency: core.settings.getCurrency(state),
    rates: core.rates.getRates(state)
  }
}

export default connect(mapStateToProps)(CurrencyDisplay)
