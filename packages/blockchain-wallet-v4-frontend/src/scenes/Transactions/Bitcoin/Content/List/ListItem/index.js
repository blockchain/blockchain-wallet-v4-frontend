import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ListItem from './template.js'

class ListItemContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCoinToggle = this.handleCoinToggle.bind(this)
  }

  handleToggle () {
    // const { transaction, fiatAtTime } = this.props
    // if (!this.state.toggled && !fiatAtTime) {
    //   this.props.bitcoinTransactionsActions.getBitcoinFiatAtTime('bitcoin', transaction.hash, transaction.amount, transaction.time * 1000)
    // }

    this.setState({ toggled: !this.state.toggled })
  }

  handleCoinToggle () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    const { fiatAtTime } = this.props

    return <ListItem
      fiatAtTime={fiatAtTime}
      toggled={this.state.toggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleCoinToggle}
    />
  }
}

const mapStateToProps = (state, ownProps) => ({
  transaction: selectors.modules.transactionBitcoin.getTransactionBitcoin(state, ownProps.transaction.hash, ownProps.currency)
})

const mapDispatchToProps = (dispatch) => ({
  bitcoinTransactionsActions: bindActionCreators(actions.modules.transactionBitcoin),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ListItemContainer)
