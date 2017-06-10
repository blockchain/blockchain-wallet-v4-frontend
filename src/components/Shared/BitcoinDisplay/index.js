import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { prop } from 'ramda'
import { core, ui } from 'data/rootSelectors'
import * as uiActions from 'data/UI/actions.js'

console.log(uiActions)

const BitcoinDisplay = (props) => {
  let result = 'N/A'
  let convertedAmount = 0

  console.log(props)

  if (props.bitcoinDisplayed) {
    switch (props.unit) {
      case 'MBC': // TODO: µBTC
        convertedAmount = parseFloat((props.amount * 1000).toFixed(5))
        break
      case 'UBC':
        convertedAmount = parseFloat((props.amount * 1000000).toFixed(2))
        break
      default: convertedAmount = props.amount
    }
    result = `${convertedAmount} ${props.unit}`
  } else {
    let ratio = prop(props.currency, props.rates).last
    convertedAmount = parseFloat((props.amount * ratio).toFixed(2))
    result = `${convertedAmount} ${props.currency}`
  }

  return (
    <span className={props.className} onClick={props.actions.toggleCurrencyDisplay}>{result}</span>
  )
}

function mapStateToProps (state) {
  return {
    bitcoinDisplayed: ui.getBitcoinDisplayed(state),
    unit: core.settings.getBtcCurrency(state),
    currency: core.settings.getCurrency(state),
    rates: core.rates.getRates(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinDisplay)
