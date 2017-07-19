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
    this.handleClickCoinDisplay = this.handleClickCoinDisplay.bind(this)
  }

  handleClickDetail () {
    this.setState({ detailsDisplayed: !this.state.detailsDisplayed })
  }

  handleClickCoinDisplay () {
    this.props.actions.toggleCurrencyDisplay()
  }

  render () {
    return (
      <TransactionList
        transaction={this.props.transaction}
        detailsDisplayed={this.state.detailsDisplayed}
        clickDetails={this.handleClickDetail}
        coinDisplayed={this.props.coinDisplayed}
        clickCoinDisplay={this.handleClickCoinDisplay}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    coinDisplayed: selectors.ui.getCoinDisplayed(state),
    balance: selectors.core.info.getBalance(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListContainer)
