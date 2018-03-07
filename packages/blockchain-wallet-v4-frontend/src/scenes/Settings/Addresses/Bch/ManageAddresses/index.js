import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import settings from 'config'
import ManageAddressesTemplate from './template'

class ManageAddressesContainer extends React.Component {
  render () {
    const { account, labels, receiveIndex, isDefault, kvStoreBchActions, addressesBchActions, modalsActions, routerActions } = this.props

    const deriveAddress = (i) => Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BCH)

    const onSetLabel = (i, label) => kvStoreBchActions.setHdAddressLabel(account.index, i, label)
    const onEditLabel = (i) => addressesBchActions.editHdLabel(account.index, i)
    const onDeleteLabel = (i) => kvStoreBchActions.deleteHdAddressLabel(account.index, i)
    const oneditBchAccountLabel = () => addressesBchActions.editBchAccountLabel(account.index, account.label)
    const onShowXPub = () => modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    const onMakeDefault = () => kvStoreBchActions.setDefaultAccountIdx(account.index)

    const onSetArchived = () => {
      kvStoreBchActions.setAccountArchived(account.index, true)
      routerActions.push('/settings/addresses')
    }

    const props = { account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, oneditBchAccountLabel, onShowXPub, onMakeDefault, onSetArchived }
    return <ManageAddressesTemplate {...props} />
  }
}

const mapStateToProps = (state, props) => {
  const index = props.computedMatch.params.index
  const isDefault = parseInt(index) === Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(index)
  const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
  const nextReceiveIndex = selectors.core.data.bch.getReceiveIndex(account.xpub, state)
  const lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  const receiveIndex = nextReceiveIndex.map(i => Math.max(i, lastLabeledIndex + 1))
  return { account, labels, receiveIndex, isDefault }
}

const mapDispatchToProps = (dispatch) => ({
  kvStoreBchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  addressesBchActions: bindActionCreators(actions.modules.addressesBch, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageAddressesContainer)
