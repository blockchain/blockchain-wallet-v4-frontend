import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UsedAddressesShowTemplate from './template'

class UsedAddressesContainer extends React.PureComponent {
  onShowUsedAddresses = () => {
    const {
      componentActions,
      derivation,
      modalsActions,
      usedAddressesVisible,
      walletIndex
    } = this.props
    if (usedAddressesVisible) {
      componentActions.toggleUsedAddresses(walletIndex, derivation, false)
    } else {
      modalsActions.showModal('ShowUsedAddresses', { walletIndex, derivation })
    }
  }

  render () {
    const { derivation, usedAddressesVisible, walletIndex } = this.props

    return (
      <UsedAddressesShowTemplate
        derivation={derivation}
        onShowUsedAddresses={this.onShowUsedAddresses}
        usedAddressesVisible={usedAddressesVisible}
        walletIndex={walletIndex}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  usedAddressesVisible: selectors.components.manageAddresses.getWalletUsedAddressVisibility(
    state,
    ownProps.walletIndex,
    ownProps.derivation
  )
})

const mapDispatchToProps = dispatch => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsedAddressesContainer)
