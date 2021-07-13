import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { includes } from 'ramda'
import { bindActionCreators } from 'redux'

import {
  CoinType,
  FiatType,
  ProcessedTxType
} from 'blockchain-wallet-v4/src/types'
import { actions, model, selectors } from 'data'

import NonCustodialTx from './template'

const { TRANSACTION_EVENTS } = model.analytics

class NonCustodialTxListItem extends React.PureComponent<Props> {
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
          'components/NonCustodialTx',
          'handleEditDescription',
          'Unsupported Coin Code'
        )
      }
    }
  }

  handleRetrySendEth = (e, txHash, isErc20) => {
    e.stopPropagation()
    this.props.sendEthActions.retrySendEth(txHash, isErc20)
  }

  onViewTxDetails = coin => {
    this.props.analyticsActions.logEvent([
      ...TRANSACTION_EVENTS.VIEW_TX_ON_EXPLORER,
      coin
    ])
  }

  render() {
    return (
      <NonCustodialTx
        {...this.props}
        handleEditDescription={this.handleEditDescription}
        handleRetrySendEth={this.handleRetrySendEth}
        handleToggle={this.handleToggle}
        onViewTxDetails={this.onViewTxDetails}
        isToggled={this.state.isToggled}
      />
    )
  }
}

const mapStateToProps = state => ({
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  bchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  ethActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  ethTxActions: bindActionCreators(actions.core.data.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  sendEthActions: bindActionCreators(actions.components.sendEth, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  xlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  coinTicker: string
  currency: FiatType
  transaction: ProcessedTxType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NonCustodialTxListItem)
