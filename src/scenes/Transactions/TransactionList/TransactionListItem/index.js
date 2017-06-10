import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import { core, ui } from 'data/rootSelectors'
import * as uiActions from 'data/UI/actions.js'

import TransactionList from './template.js'

class TransactionListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { detailsDisplayed: false }
    this.handleClickDetail = this.handleClickDetail.bind(this)
    this.handleClickBitcoinDisplay = this.handleClickBitcoinDisplay.bind(this)
  }

  handleClickDetail () {
    this.setState({ detailsDisplayed: !this.state.detailsDisplayed })
  }

  handleClickBitcoinDisplay () {
    this.props.actions.toggleCurrencyDisplay()
  }

  render () {
    return (
      <TransactionList
        transaction={this.props.transaction}
        detailsDisplayed={this.state.detailsDisplayed}
        clickDetails={this.handleClickDetail}
        bitcoinDisplayed={this.props.bitcoinDisplayed}
        clickBitcoinDisplay={this.handleClickBitcoinDisplay}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bitcoinDisplayed: ui.getBitcoinDisplayed(state),
    balance: core.info.getBalance(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
