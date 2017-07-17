import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import { selectors, actions } from 'data'
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

const mapStateToProps = (state) => {
  return {
    bitcoinDisplayed: selectors.ui.getBitcoinDisplayed(state),
    balance: selectors.core.info.getBalance(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
