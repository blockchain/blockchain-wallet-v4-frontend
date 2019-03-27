import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import TransactionListItem from './template'

class ListItemContainer extends React.PureComponent {
  state = { isToggled: false }

  handleToggle = () => {
    this.setState({ isToggled: !this.state.isToggled })
  }

  handleEditDescription = value => {
    switch (this.props.coin) {
      case 'ETH': {
        this.props.ethActions.setTxNotesEth(this.props.transaction.hash, value)
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
      case 'BSV': {
        this.props.bsvActions.setTxNotesBsv(this.props.transaction.hash, value)
        break
      }
      case 'XLM': {
        this.props.xlmActions.setTxNotesXlm(this.props.transaction.hash, value)
        break
      }
      default: {
        this.props.ethActions.setTxNoteErc20(
          this.props.coin,
          this.props.transaction.hash,
          value
        )
      }
    }
  }

  render () {
    const { coin, currency, transaction, buySellPartner } = this.props
    return (
      <TransactionListItem
        coin={coin}
        currency={currency}
        isToggled={this.state.isToggled}
        handleToggle={this.handleToggle}
        transaction={transaction}
        buySellPartner={buySellPartner}
        handleEditDescription={this.handleEditDescription}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ListItemContainer)
