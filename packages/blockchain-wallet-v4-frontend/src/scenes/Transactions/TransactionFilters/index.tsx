import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RootState } from 'data/rootReducer'
import Menu from './template'
import React from 'react'

// FIXME: TypeScript use CoinType
type OwnProps = {
  coin: 'BTC' | 'BCH' | 'ETH' | 'PAX' | 'XLM'
}

type LinkStatePropsType = {
  legacyEthAddress: null | boolean
}

type LinkDispatchPropsType = {
  modalActions: typeof actions.modals,
  bchActions: typeof actions.components.bchTransactions,
  btcActions: typeof actions.components.btcTransactions
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class TransactionFiltersContainer extends React.PureComponent<Props> {
  onShowPrivateKey = () => {
    const { coin, modalActions } = this.props

    if (coin === 'ETH')
      modalActions.showModal('ShowEthPrivateKey', { isLegacy: false })
    if (coin === 'XLM') modalActions.showModal('ShowXlmPrivateKey')
  }

  onShowEthPrivateKeyLegacy = () => {
    this.props.modalActions.showModal('ShowEthPrivateKey', { isLegacy: true })
  }

  handleClickReporting = () => {
    const { coin } = this.props
    if (coin === 'BTC') this.props.btcActions.reportClicked()
    if (coin === 'BCH') this.props.bchActions.reportClicked()
  }

  render () {
    const isLegacyEthAddr = this.props.coin === 'ETH' && this.props.legacyEthAddress

    return <Menu
      coin={this.props.coin}
      handleClickReporting={this.handleClickReporting}
      onShowPrivateKey={this.onShowPrivateKey}
      onShowEthPrivateKeyLegacy={this.onShowEthPrivateKeyLegacy}
      isLegacyEthAddr={isLegacyEthAddr}
    />
  }
}

const mapStateToProps = (state: RootState) => ({
  legacyEthAddr: selectors.core.kvStore.eth
    .getLegacyAccountAddress(state)
    .getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.components.btcTransactions, dispatch),
  bchActions: bindActionCreators(actions.components.bchTransactions, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionFiltersContainer)
