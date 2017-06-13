import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import { actions, selectors } from 'data'
import Balance from './template.js'

class BalanceContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickBitcoinDisplay = this.handleClickBitcoinDisplay.bind(this)
  }

  handleClickBitcoinDisplay () {
    this.props.actions.toggleCurrencyDisplay()
  }

  render () {
    return (
      <Balance
        bitcoinDisplayed={this.props.bitcoinDisplayed}
        balance={this.props.balance}
        clickBitcoinDisplay={this.handleClickBitcoinDisplay}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bitcoinDisplayed: selectors.ui.getBitcoinDisplayed(state),
    balance: selectors.core.info.getBalance(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceContainer)
