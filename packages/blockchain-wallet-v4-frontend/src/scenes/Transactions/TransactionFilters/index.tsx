import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { CoinType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import Menu from './template'
import React from 'react'

class TransactionFiltersContainer extends React.PureComponent<Props> {
  onShowPrivateKey = () => {
    const { coin, modalActions } = this.props

    if (coin === 'ETH')
      modalActions.showModal('ShowEthPrivateKey', {
        origin: 'TransactionList',
        isLegacy: false
      })
    if (coin === 'XLM')
      modalActions.showModal('ShowXlmPrivateKey', { origin: 'TransactionList' })
  }

  onShowEthPrivateKeyLegacy = () => {
    this.props.modalActions.showModal('ShowEthPrivateKey', {
      origin: 'TransactionList',
      isLegacy: true
    })
  }

  handleClickReporting = () => {
    const { coin, modalActions } = this.props
    modalActions.showModal('TRANSACTION_REPORT', {
      coin,
      origin: 'TransactionList'
    })
  }

  render () {
    const isLegacyEthAddr =
      this.props.coin === 'ETH' && this.props.legacyEthAddr

    return (
      <Menu
        coin={this.props.coin}
        handleClickReporting={this.handleClickReporting}
        onShowPrivateKey={this.onShowPrivateKey}
        onShowEthPrivateKeyLegacy={this.onShowEthPrivateKeyLegacy}
        isLegacyEthAddr={isLegacyEthAddr}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  legacyEthAddr: selectors.core.kvStore.eth
    .getLegacyAccountAddress(state)
    .getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.components.btcTransactions, dispatch),
  bchActions: bindActionCreators(actions.components.bchTransactions, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  coin: CoinType
}

type LinkStatePropsType = {
  legacyEthAddr: null | boolean
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFiltersContainer)
