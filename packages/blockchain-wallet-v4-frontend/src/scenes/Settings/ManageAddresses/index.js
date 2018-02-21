import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import settings from 'config'
import ManageAddressesTemplate from './template'

class ManageAddressesContainer extends React.Component {
  render () {
    let { account, labels, receiveIndex, actions } = this.props

    let deriveAddress = (i) => Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN)

    let onSetLabel = (i) => actions.setHdAddressLabel(account.index, i, 'New Address')
    let onDeleteLabel = (i) => actions.deleteHdAddressLabel(account.index, i)

    let props = { account, labels, receiveIndex, deriveAddress, onSetLabel, onDeleteLabel }
    return <ManageAddressesTemplate {...props} />
  }
}

const mapStateToProps = (state, props) => {
  let index = props.computedMatch.params.index
  let account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(index)
  let labels = Types.HDAccount.selectAddressLabels(account).toArray()
  let nextReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  let lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  let receiveIndex = nextReceiveIndex.map(i => Math.max(i, lastLabeledIndex + 1))
  return { account, labels, receiveIndex }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageAddressesContainer)
