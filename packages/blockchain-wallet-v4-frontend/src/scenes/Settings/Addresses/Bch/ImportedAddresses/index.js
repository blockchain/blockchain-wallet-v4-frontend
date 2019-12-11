import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { toCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import BchImportedAddresses from './template'
import React from 'react'

const { WALLET_TX_SEARCH } = model.form

class ImportedAddressesContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  handleClickImport = () => {
    this.props.modalActions.showModal('ImportBchAddress')
  }

  handleTransferAll = () => {
    this.props.actions.showModal(model.components.sendBch.MODAL, {
      from: 'allImportedAddresses',
      excludeHDWallets: true
    })
  }

  handleShowPriv = address => {
    const bchAddr = toCashAddr(address.addr)
    this.props.modalActions.showModal('ShowBchPrivateKey', {
      privkey: address.priv,
      addr: address.addr,
      bchAddr: bchAddr,
      balance: address.info.final_balance
    })
  }

  handleEditLabel = address => {
    this.props.componentActions.editImportedAddressLabel(address)
  }

  handleSignMessage = address => {
    const bchAddr = toCashAddr(address.addr)
    this.props.modalActions.showModal('SignMessageBch', {
      address: address.addr,
      bchAddr: bchAddr,
      privKey: address.priv
    })
  }

  handleClickVerify = () => {
    this.props.modalActions.showModal('VerifyMessage')
  }

  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: addresses => {
        const addressList = Object.values(addresses)
        return (
          <BchImportedAddresses
            importedAddresses={addressList}
            onTransferAll={this.handleTransferAll}
            onEditLabel={this.handleEditLabel}
            handleShowPriv={this.handleShowPriv}
            handleSignMessage={this.handleSignMessage}
            handleClickImport={this.handleClickImport}
            onClickVerify={this.handleClickVerify}
            {...rest}
          />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modals, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddressesBch,
    dispatch
  )
})

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportedAddressesContainer)
