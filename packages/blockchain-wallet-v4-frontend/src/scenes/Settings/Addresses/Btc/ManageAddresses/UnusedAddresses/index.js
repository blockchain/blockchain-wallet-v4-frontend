import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { length } from 'ramda'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'

import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import UnusedAddressesTemplate from './template'

class UnusedAddressesContainer extends React.PureComponent {
  componentWillMount () {
    this.props.componentActions.fetchUnusedAddresses(this.props.walletIndex)
  }

  render () {
    const { account, unusedAddresses, currentReceiveIndex, isDefault, coreActions, walletActions, modalsActions, routerActions, search } = this.props
    const onEditLabel = (i) => this.props.componentActions.editAddressLabel(account.index, this.props.walletIndex, i)
    const onDeleteLabel = (i) => this.props.componentActions.deleteAddressLabel(account.index, this.props.walletIndex, i)
    const onEditBtcAccountLabel = () => walletActions.editBtcAccountLabel(account.index, account.label)
    const onShowXPub = () => modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    const onMakeDefault = () => coreActions.setDefaultAccountIdx(account.index)
    const onGenerateNextAddress = () => {
      if (length(this.props.unusedAddresses.getOrElse([])) >= 15) {
        this.props.alertActions.displayError(C.ADDRESS_LABEL_MAXIMUM_ERROR)
      } else {
        this.props.componentActions.generateNextReceiveAddress(this.props.walletIndex)
      }
    }
    const onSetArchived = () => {
      coreActions.setAccountArchived(account.index, true)
      routerActions.push('/settings/addresses')
    }
    const props = { account, unusedAddresses, currentReceiveIndex, isDefault, onGenerateNextAddress, onEditLabel, search, onDeleteLabel, onEditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived }

    return !unusedAddresses ? null : unusedAddresses.cata({
      Success: (value) => <UnusedAddressesTemplate {...props} unusedAddresses={value} />,
      Failure: () => <div/>,
      Loading: () => <div/>,
      NotAsked: () => <div/>
    })
  }
}

UnusedAddressesContainer.propTypes = {
  index: PropTypes.number.required
}

const mapStateToProps = (state, ownProps) => {
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(ownProps.walletIndex)
  const isDefault = parseInt(ownProps.walletIndex) === Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  const unusedAddresses = selectors.components.manageAddresses.getWalletUnusedAddresses(state, ownProps.walletIndex)
  const currentReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  const search = formValueSelector('manageAddresses')(state, 'search')

  return { account, isDefault, currentReceiveIndex, unusedAddresses, search }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  componentActions: bindActionCreators(actions.components.manageAddresses, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UnusedAddressesContainer)
