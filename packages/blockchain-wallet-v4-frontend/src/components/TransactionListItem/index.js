import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import TransactionListItem from './template.js'

class ListItemContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleCoinToggle = this.handleCoinToggle.bind(this)
    this.handleEditDescription = this.handleEditDescription.bind(this)
  }

  handleCoinToggle () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  handleEditDescription (value) {
    switch (this.props.coin) {
      case 'ETH': {
        this.props.ethereumActions.setTxNotesEthereum(this.props.transaction.hash, value)
        break
      }
      case 'BTC': {
        this.props.walletActions.setTransactionNote(this.props.transaction.hash, value)
        break
      }
    }
  }

  render () {
    return <TransactionListItem
      coin={this.props.coin}
      minConfirmations={this.props.minConfirmations}
      transaction={this.props.transaction}
      handleCoinToggle={this.handleCoinToggle}
      handleEditDescription={this.handleEditDescription}
    />
  }
}

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  ethereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListItemContainer)
