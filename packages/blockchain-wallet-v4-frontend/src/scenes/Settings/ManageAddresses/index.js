import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import settings from 'config'
import ManageAddressesTemplate from './template'

class ManageAddressesContainer extends React.Component {
  render () {
    let { account, labels, receiveIndex, isDefault, coreActions, walletActions, modalsActions, routerActions } = this.props

    let deriveAddress = (i) => Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN)

    let onSetLabel = (i, label) => coreActions.setHdAddressLabel(account.index, i, label)
    let onEditLabel = (i) => walletActions.editHdLabel(account.index, i)
    let onDeleteLabel = (i) => coreActions.deleteHdAddressLabel(account.index, i)
    let onEditAccountLabel = () => walletActions.editAccountLabel(account.index, account.label)
    let onShowXPub = () => modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    let onMakeDefault = () => coreActions.setDefaultAccountIdx(account.index)

    let onSetArchived = () => {
      coreActions.setAccountArchived(account.index, true)
      routerActions.push('/settings/addresses')
    }

    let props = { account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, onEditAccountLabel, onShowXPub, onMakeDefault, onSetArchived }
    return <ManageAddressesTemplate {...props} />
  }
}

const mapStateToProps = (state, props) => {
  let index = props.computedMatch.params.index
  let isDefault = parseInt(index) === Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  let account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(index)
  let labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
  let nextReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  let lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  let receiveIndex = nextReceiveIndex.map(i => Math.max(i, lastLabeledIndex + 1))
  return { account, labels, receiveIndex, isDefault }
}

const mapDispatchToProps = (dispatch) => ({
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageAddressesContainer)
