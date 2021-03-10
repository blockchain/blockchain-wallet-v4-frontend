import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import UsedAddressesShowTemplate from './template'

class UsedAddressesContainer extends React.PureComponent<Props> {
  onShowUsedAddresses = () => {
    if (this.props.usedAddressesVisible) {
      this.props.componentActions.toggleUsedAddresses(
        this.props.walletIndex,
        false
      )
    } else {
      this.props.modalsActions.showModal('ShowUsedAddresses', {
        walletIndex: this.props.walletIndex,
        origin: 'SettingsPage'
      })
    }
  }

  render() {
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
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = { walletIndex: number } & ConnectedProps<typeof connector>

export default connector(UsedAddressesContainer)
