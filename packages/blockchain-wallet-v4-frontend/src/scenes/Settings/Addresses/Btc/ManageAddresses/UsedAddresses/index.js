import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import UsedAddressesTemplate from './template'

class UsedAddressesContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onShowUsedAddresses = this.onShowUsedAddresses.bind(this)
  }

  componentDidMount () {
    this.props.componentActions.fetchUsedAddresses(this.props.walletIndex)
  }

  onShowUsedAddresses () {
    if (this.props.usedAddressesVisible) {
      this.props.componentActions.toggleUsedAddresses(this.props.walletIndex, false)
    } else {
      this.props.modalsActions.showModal('ShowUsedAddresses', { walletIndex: this.props.walletIndex })
    }
  }

  render () {
    const { usedAddresses, usedAddressesVisible } = this.props

    // return (<UsedAddressesTemplate usedAddresses={usedAddresses} usedAddressesVisible={usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} />)

    return (
      usedAddresses.cata({
        Success: (value) => <UsedAddressesTemplate usedAddresses={value} usedAddressesVisible={usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div>LOADING</div>,
        NotAsked: () => <div/>
      })
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // TODO: better way to this?
  if (!state.components.usedAddresses[ownProps.walletIndex]) {
    state.components.usedAddresses[ownProps.walletIndex] = {
      visible: false,
      addresses: Remote.NotAsked
    }
  }
  return {
    usedAddressesVisible: selectors.components.usedAddresses.getWalletUsedAddressVisibility(state, ownProps.walletIndex),
    usedAddresses: selectors.components.usedAddresses.getWalletUsedAddresses(state, ownProps.walletIndex)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesContainer)
