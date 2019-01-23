import React from 'react'
import { actions, selectors, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ImportedAddresses from './template'
import { Remote } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
import { values } from 'ramda'
const { WALLET_TX_SEARCH } = model.form

class ImportedAddressesContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  handleClickImport = () => {
    this.props.modalActions.showModal('ImportBtcAddress')
  }

  handleClickVerify = () => {
    this.props.modalActions.showModal('VerifyMessage')
  }

  handleShowPriv = address => {
    this.props.modalActions.showModal('ShowBtcPrivateKey', {
      addr: address.addr,
      balance: address.info.final_balance
    })
  }

  handleSignMessage = address => {
    this.props.modalActions.showModal('SignMessage', {
      address: address.addr
    })
  }

  handleToggleArchived = address => {
    let isArchived = address.tag === 2
    this.props.coreActions.setAddressArchived(address.addr, !isArchived)
  }

  handleTransferAll = () => {
    this.props.modalActions.showModal(model.components.sendBtc.MODAL, {
      from: 'allImportedAddresses',
      excludeHDWallets: true
    })
  }

  render () {
    const { search, addressesWithoutRemoteData } = this.props
    return this.props.activeAddresses.cata({
      Success: value => (
        <ImportedAddresses
          importedAddresses={value}
          onClickImport={this.handleClickImport}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onToggleArchived={this.handleToggleArchived}
          onTransferAll={this.handleTransferAll}
          onShowPriv={this.handleShowPriv}
          onShowSignMessage={this.handleSignMessage}
        />
      ),
      Failure: () => (
        <ImportedAddresses
          failure
          importedAddresses={values(addressesWithoutRemoteData)}
          onClickImport={this.handleClickImport}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onToggleArchived={this.handleToggleArchived}
          onTransferAll={this.handleTransferAll}
          onShowSignMessage={this.handleSignMessage}
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportedAddressesContainer)
