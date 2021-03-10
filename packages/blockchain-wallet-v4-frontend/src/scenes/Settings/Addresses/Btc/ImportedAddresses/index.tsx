import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { values } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model, selectors } from 'data'

import ImportedAddresses from './template'
const { WALLET_TX_SEARCH } = model.form

class ImportedAddressesContainer extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  handleClickVerify = () => {
    this.props.modalActions.showModal('VerifyMessage', {
      origin: 'SettingsPage'
    })
  }

  handleShowPriv = address => {
    this.props.modalActions.showModal('ShowBtcPrivateKey', {
      addr: address.addr,
      balance: address.info.final_balance,
      origin: 'SettingsPage'
    })
  }

  handleSignMessage = address => {
    this.props.modalActions.showModal('SignMessage', {
      address: address.addr,
      origin: 'SettingsPage'
    })
  }

  handleEditLabel = address => {
    this.props.componentActions.editImportedAddressLabel(address.addr)
  }

  handleToggleArchived = address => {
    let isArchived = address.tag === 2
    this.props.coreActions.setAddressArchived(address.addr, !isArchived)
  }

  handleTransferAll = () => {
    this.props.modalActions.showModal(model.components.sendBtc.MODAL, {
      from: 'allImportedAddresses',
      excludeHDWallets: true,
      origin: 'SettingsPage'
    })
  }

  render() {
    const { addressesWithoutRemoteData, search } = this.props
    return this.props.activeAddresses.cata({
      Success: value => (
        <ImportedAddresses
          importedAddresses={value}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onToggleArchived={this.handleToggleArchived}
          onTransferAll={this.handleTransferAll}
          onShowPriv={this.handleShowPriv}
          onShowSignMessage={this.handleSignMessage}
          onEditLabel={this.handleEditLabel}
        />
      ),
      Failure: () => (
        <ImportedAddresses
          failure
          importedAddresses={values(addressesWithoutRemoteData)}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onShowPriv={this.handleShowPriv}
          onToggleArchived={this.handleToggleArchived}
          onTransferAll={this.handleTransferAll}
          onShowSignMessage={this.handleSignMessage}
          onEditLabel={this.handleEditLabel}
        />
      ),
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  activeAddresses: selectors.core.common.btc.getActiveAddresses(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search'),
  addressesWithoutRemoteData: selectors.core.wallet.getAddresses(state)
})

const mapDispatchToProps = dispatch => ({
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ImportedAddressesContainer)
