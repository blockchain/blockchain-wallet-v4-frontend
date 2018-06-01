import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UsedAddressesShowTemplate from './template'

class UsedAddressesContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onShowUsedAddresses = this.onShowUsedAddresses.bind(this)
  }

  onShowUsedAddresses () {
    if (this.props.usedAddressesVisible) {
      this.props.componentActions.toggleUsedAddresses(this.props.walletIndex, false)
    } else {
      this.props.modalsActions.showModal('ShowUsedAddresses', { walletIndex: this.props.walletIndex })
    }
  }

  render () {
    const { usedAddressesVisible, walletIndex } = this.props

    return <UsedAddressesShowTemplate usedAddressesVisible={usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} walletIndex={walletIndex} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  usedAddressesVisible: selectors.components.manageAddresses.getWalletUsedAddressVisibility(state, ownProps.walletIndex)
})

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(actions.components.manageAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesContainer)
