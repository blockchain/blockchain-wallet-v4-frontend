import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes } from 'ramda'

import { actions, model, selectors } from 'data'
import TransactionListItem from './template'

const { TRANSACTION_EVENTS } = model.analytics
class ListItemContainer extends React.PureComponent {
  state = { isToggled: false }

  handleToggle = () => {
    this.setState({ isToggled: !this.state.isToggled })
  }

  handleEditDescription = value => {
    const { coin, erc20List, transaction } = this.props
    // TODO: ERC20 make more generic
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
      case includes(coin, erc20List): {
        this.props.ethActions.setTxNotesErc20(coin, transaction.hash, value)
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

  onViewTxDetails = coin => {
    this.props.analyticsActions.logEvent([
      ...TRANSACTION_EVENTS.VIEW_TX_ON_EXPLORER,
      coin
    ])
  }

  render () {
    const { coin, currency, transaction, buySellPartner } = this.props
    return (
      <TransactionListItem
        buySellPartner={buySellPartner}
        coin={coin}
        currency={currency}
        handleEditDescription={this.handleEditDescription}
        handleToggle={this.handleToggle}
        isToggled={this.state.isToggled}
        onViewTxDetails={this.onViewTxDetails}
        transaction={transaction}
      />
    )
  }
}

const mapStateToProps = state => ({
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrFail()
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItemContainer)
