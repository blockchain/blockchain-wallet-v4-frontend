import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model, selectors } from 'data'
import UsedAddressesShowTemplate from './template'

const { HIDE_USED_ADDRS, SHOW_USED_ADDRS } = model.analytics.ADDRESS_EVENTS
class UsedAddressesContainer extends React.PureComponent {
  onShowUsedAddresses = () => {
    if (this.props.usedAddressesVisible) {
      this.props.componentActions.toggleUsedAddresses(
        this.props.walletIndex,
        false
      )
      this.props.analyticsActions.logEvent(HIDE_USED_ADDRS)
    } else {
      this.props.modalsActions.showModal('ShowUsedAddresses', {
        walletIndex: this.props.walletIndex
      })
      this.props.analyticsActions.logEvent(SHOW_USED_ADDRS)
    }
  }

  render () {
    const { usedAddressesVisible, walletIndex } = this.props

    return (
      <UsedAddressesShowTemplate
        usedAddressesVisible={usedAddressesVisible}
        onShowUsedAddresses={this.onShowUsedAddresses}
        walletIndex={walletIndex}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  usedAddressesVisible: selectors.components.manageAddresses.getWalletUsedAddressVisibility(
    state,
    ownProps.walletIndex
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
