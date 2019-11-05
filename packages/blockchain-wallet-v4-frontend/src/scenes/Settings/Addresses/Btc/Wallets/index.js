import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'

import { actions, model } from 'data'
import { getData, getWalletsWithoutRemoteData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { requireUniqueWalletName } from 'services/FormHelper'
import Template from './template'

const { WALLET_TX_SEARCH } = model.form

class BtcWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onAddNewWallet = wallets => {
    const allWalletLabels = wallets.map(wallet => wallet.label)
    this.props.modalActions.showModal('AddBtcWallet', {
      uniqueWalletName: value => requireUniqueWalletName(value, allWalletLabels)
    })
  }

  onUnarchive = i => {
    this.props.coreActions.setAccountArchived(i, false)
  }

  render () {
    const { search, data, walletsWithoutRemoteData, ...rest } = this.props

    return data.cata({
      Success: value => (
        <Template
          wallets={value}
          search={search && search.toLowerCase()}
          onUnarchive={this.onUnarchive}
          onAddNewWallet={() => {
            this.onAddNewWallet(value)
          }}
          {...rest}
        />
      ),
      Failure: message => (
        <Template
          failure
          message={message}
          wallets={walletsWithoutRemoteData}
          search={search && search.toLowerCase()}
          onUnarchive={this.onUnarchive}
          onAddNewWallet={() => {
            this.onAddNewWallet(walletsWithoutRemoteData)
          }}
          {...rest}
        />
      ),
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  actions: bindActionCreators(actions.core.data.btc, dispatch)
})

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search'),
  walletsWithoutRemoteData: getWalletsWithoutRemoteData(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BtcWalletsContainer)
