import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import TransactionListItem from './template.js'

class ListItemContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { isToggled: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleEditDescription = this.handleEditDescription.bind(this)
  }

  handleToggle () {
    this.setState({ isToggled: !this.state.isToggled })
  }

  handleEditDescription (value) {
    switch (this.props.coin) {
      case 'ETH': {
        this.props.ethereumActions.setTxNotesEthereum(
          this.props.transaction.hash,
          value
        )
        break
      }
      case 'BTC': {
        this.props.walletActions.setTransactionNote(
          this.props.transaction.hash,
          value
        )
        break
      }
      case 'BCH': {
        this.props.bchActions.setTxNotesBch(this.props.transaction.hash, value)
        break
      }
    }
  }

  render () {
    return (
      <TransactionListItem
        coin={this.props.coin}
        currency={this.props.currency}
        isToggled={this.state.isToggled}
        handleToggle={this.handleToggle}
        transaction={this.props.transaction}
        buysellPartner={this.props.buysellPartner}
        minConfirmations={this.props.minConfirmations}
        handleEditDescription={this.handleEditDescription}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  ethereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(ListItemContainer)
