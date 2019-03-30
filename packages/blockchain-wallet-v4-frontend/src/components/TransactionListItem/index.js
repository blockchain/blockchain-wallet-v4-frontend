import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes } from 'ramda'

import { actions, model } from 'data'
import TransactionListItem from './template'

const { ERC20_COIN_LIST } = model.coins
class ListItemContainer extends React.PureComponent {
  state = { isToggled: false }

  handleToggle = () => {
    this.setState({ isToggled: !this.state.isToggled })
  }

  handleEditDescription = value => {
    const { coin, transaction } = this.props
    switch (true) {
      case coin === 'ETH': {
        this.props.ethActions.setTxNotesEth(transaction.hash, value)
        break
      }
      case coin === 'BTC': {
        this.props.walletActions.setTransactionNote(transaction.hash, value)
        break
      }
      case coin === 'BCH': {
        this.props.bchActions.setTxNotesBch(transaction.hash, value)
        break
      }
      case coin === 'BSV': {
        this.props.bsvActions.setTxNotesBsv(transaction.hash, value)
        break
      }
      case coin === 'XLM': {
        this.props.xlmActions.setTxNotesXlm(transaction.hash, value)
        break
      }
      case includes(coin, ERC20_COIN_LIST): {
        this.props.ethActions.setTxNoteErc20(coin, transaction.hash, value)
        break
      }
      default: {
        this.props.logActions.logErrorMessage(
          'components/TransactionListItem',
          'handleEditDescription',
          'Unsupported Coin Code'
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
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ListItemContainer)
