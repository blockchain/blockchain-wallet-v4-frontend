import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { path } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
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

const mapStateToProps = (state, ownProps) => {
  // since usedAddresses state tree is stored based on walletIndexes, the default states will not exist
  // on first attempt to access
  if (!path(['state', 'components', 'usedAddresses', ownProps.walletIndex])) {
    state.components.usedAddresses[ownProps.walletIndex] = {
      visible: false,
      addresses: Remote.NotAsked
    }
  }
  return {
    usedAddressesVisible: selectors.components.usedAddresses.getWalletUsedAddressVisibility(state, ownProps.walletIndex)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesContainer)
