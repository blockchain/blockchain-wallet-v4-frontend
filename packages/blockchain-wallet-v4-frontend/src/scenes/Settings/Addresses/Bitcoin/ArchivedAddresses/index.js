import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import Success from './template.success'
import { Types } from 'blockchain-wallet-v4/src'

class ArchivedAddressesContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggleArchived = this.handleToggleArchived.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleToggleArchived (address) {
    let isArchived = Types.Address.isArchived(address)
    this.props.coreActions.setAddressArchived(address.addr, !isArchived)
  }

  handleDelete (address) {
    this.props.coreActions.deleteLegacyAddress(address.addr)
  }

  render () {
    return (
      <Success archivedAddresses={this.props.archivedAddresses} onToggleArchived={this.handleToggleArchived} onDelete={this.handleDelete} />
    )
  }
}

const selectArchived = compose(Types.AddressMap.selectArchived, Types.Wallet.selectAddresses, selectors.core.wallet.getWallet)

const mapStateToProps = (state) => ({
  archivedAddresses: selectArchived(state).toArray()
})

const mapDispatchToProps = (dispatch) => ({
  coreActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchivedAddressesContainer)
