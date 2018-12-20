import React from 'react'
import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
import { values, prop } from 'ramda'

class ImportedAddressesContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  handleAddressClick = (address) => {
    this.props.modalsActions.showModal('RequestBtc', {
      receiveAddressFromProps: prop('addr', address)
    })
  }

  handleClickImport = () => {
    this.props.modalsActions.showModal('ImportBtcAddress')
  }

  handleClickVerify = () => {
    this.props.modalsActions.showModal('VerifyMessage')
  }

  handleShowPriv = (address) => {
    this.props.modalsActions.showModal('ShowBtcPrivateKey', {
      addr: address.addr,
      balance: address.info.final_balance
    })
  }

  handleSignMessage = (address) => {
    this.props.modalsActions.showModal('SignMessage', {
      address: address.addr
    })
  }

  handleToggleArchived = (address) => {
    let isArchived = address.tag === 2
    this.props.coreActions.setAddressArchived(address.addr, !isArchived)
  }

  render () {
    const { search, addressesWithoutRemoteData } = this.props
    return this.props.activeAddresses.cata({
      Success: value => (
        <Success
          handleAddressClick={this.handleAddressClick}
          importedAddresses={value}
          onClickImport={this.handleClickImport}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onToggleArchived={this.handleToggleArchived}
          onShowPriv={this.handleShowPriv}
          onShowSignMessage={this.handleSignMessage}
        />
      ),
      Failure: message => (
        <Success
          failure
          importedAddresses={values(addressesWithoutRemoteData)}
          onClickImport={this.handleClickImport}
          onClickVerify={this.handleClickVerify}
          search={search && search.toLowerCase()}
          onToggleArchived={this.handleToggleArchived}
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
  search: formValueSelector('settingsAddresses')(state, 'search'),
  addressesWithoutRemoteData: selectors.core.wallet.getAddresses(state)
})

const mapDispatchToProps = dispatch => ({
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportedAddressesContainer)
