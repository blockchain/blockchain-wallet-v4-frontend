import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { length } from 'ramda'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'

import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import settings from 'config'
import UnusedAddressesTemplate from './template'

class UnusedAddressesContainer extends React.PureComponent {
  render () {
    const { account, labels, receiveIndex, isDefault, coreActions, walletActions, modalsActions, routerActions, search } = this.props
    const deriveAddress = (i) => Types.HDAccount.getReceiveAddress(account, i, settings.NETWORK_BITCOIN)
    const onSetLabel = (i, label) => {
      if (length(labels) >= 15) {
        this.props.alertActions.displayError(C.ADDRESS_LABEL_MAXIMUM_ERROR)
      } else {
        coreActions.setHdAddressLabel(account.index, i, label)
      }
    }
    const onEditLabel = (i) => walletActions.editHdLabel(account.index, i)
    const onDeleteLabel = (i) => coreActions.deleteHdAddressLabel(account.index, i)
    const onEditBtcAccountLabel = () => walletActions.editBtcAccountLabel(account.index, account.label)
    const onShowXPub = () => modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    const onMakeDefault = () => coreActions.setDefaultAccountIdx(account.index)
    const onSetArchived = () => {
      coreActions.setAccountArchived(account.index, true)
      routerActions.push('/settings/addresses')
    }
    const props = { account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, onEditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived, search }

    return <UnusedAddressesTemplate {...props} />
  }
}

UnusedAddressesContainer.propTypes = {
  index: PropTypes.number.required
}

const mapStateToProps = (state, props) => {
  const isDefault = parseInt(props.walletIndex) === Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(props.walletIndex)
  const labels = Types.HDAccount.selectAddressLabels(account).reverse().toArray()
  const nextReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  const lastLabeledIndex = labels.reduce((acc, l) => Math.max(acc, l.index), 0)
  const receiveIndex = nextReceiveIndex.map(i => Math.max(i, lastLabeledIndex + 1))
  const search = formValueSelector('manageAddresses')(state, 'search')

  return { account, labels, receiveIndex, isDefault, search }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UnusedAddressesContainer)
