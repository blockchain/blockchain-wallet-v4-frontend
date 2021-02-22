import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import { HDDerivationType } from 'core/types'
import UsedAddressesShowTemplate from './template'

class UsedAddressesContainer extends React.PureComponent<Props> {
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
      modalsActions.showModal('ShowUsedAddresses', {
        origin: 'SettingsPage',
        walletIndex,
        derivation
      })
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

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = {
  derivation: HDDerivationType,
  walletIndex: number
} & ConnectedProps<typeof connector>

export default connector(UsedAddressesContainer)
