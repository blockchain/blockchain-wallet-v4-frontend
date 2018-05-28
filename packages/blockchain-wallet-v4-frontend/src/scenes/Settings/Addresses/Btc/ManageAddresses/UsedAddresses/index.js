import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import settings from 'config'
import { Types } from 'blockchain-wallet-v4'
import { actions, selectors } from 'data'
import UsedAddressesTemplate from './template'

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
    const { account,nextReceiveIndex, usedAddressesVisible } = this.props
    // console.info(this.props)
    console.log(nextReceiveIndex)
    var i = 0
    while (i <= nextReceiveIndex.data) {
      console.log(i)
      console.info(Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN))
      i++
    }

    return <UsedAddressesTemplate usedAddressesVisible={usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const usedAddressesVisible = selectors.components.usedAddresses.getWalletUsedAddressVisibility(state, ownProps.walletIndex)
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(ownProps.walletIndex)
  const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
  const nextReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  const lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  const usedAddresses = se

  return { usedAddressesVisible, account, nextReceiveIndex, lastLabeledIndex }
}

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  componentActions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesContainer)
