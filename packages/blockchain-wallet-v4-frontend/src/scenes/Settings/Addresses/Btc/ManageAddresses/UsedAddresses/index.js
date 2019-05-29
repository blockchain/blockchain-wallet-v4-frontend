import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model, selectors } from 'data'
import UsedAddressesShowTemplate from './template'

const { HIDE_USED_ADDRS, SHOW_USED_ADDRS } = model.analytics.ADDRESS_EVENTS
class UsedAddressesContainer extends React.PureComponent {
  onShowUsedAddresses = () => {
    const {
      analyticsActions,
      componentActions,
      derivation,
      modalsActions,
      usedAddressesVisible,
      walletIndex
    } = this.props
    if (usedAddressesVisible) {
      componentActions.toggleUsedAddresses(walletIndex, derivation, false)
      analyticsActions.logEvent(HIDE_USED_ADDRS)
    } else {
      modalsActions.showModal('ShowUsedAddresses', { walletIndex, derivation })
      analyticsActions.logEvent(SHOW_USED_ADDRS)
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
