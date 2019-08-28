import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors, model } from 'data'
import ArchivedAddresses from './template'
import { Types } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
const { WALLET_TX_SEARCH } = model.form

class ArchivedAddressesContainer extends React.PureComponent {
  handleToggleArchived = address => {
    let isArchived = Types.Address.isArchived(address)
    this.props.coreActions.setAddressArchived(address.addr, !isArchived)
  }

  handleDelete = address => {
    this.props.coreActions.deleteLegacyAddress(address.addr)
  }

  render () {
    const { archivedAddresses, search } = this.props
    return (
      <ArchivedAddresses
        search={search && search.toLowerCase()}
        onToggleArchived={this.handleToggleArchived}
        archivedAddresses={archivedAddresses}
        onDelete={this.handleDelete}
      />
    )
  }
}

const selectArchived = compose(
  Types.AddressMap.selectArchived,
  Types.Wallet.selectAddresses,
  selectors.core.wallet.getWallet
)

const mapStateToProps = state => ({
  archivedAddresses: selectArchived(state).toArray(),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  coreActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchivedAddressesContainer)
