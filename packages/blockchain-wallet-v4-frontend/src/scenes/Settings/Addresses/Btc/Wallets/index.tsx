import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'
import { requireUniqueWalletName } from 'services/forms'

import { getData, getWalletsWithoutRemoteData } from './selectors'
import Template from './template'

const { WALLET_TX_SEARCH } = model.form

class BtcWalletsContainer extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onAddNewWallet = wallets => {
    const allWalletLabels = wallets.map(wallet => wallet.label)
    this.props.modalActions.showModal('AddBtcWallet', {
      uniqueWalletName: value =>
        requireUniqueWalletName(value, allWalletLabels),
      origin: 'SettingsPage'
    })
  }

  onUnarchive = i => {
    this.props.coreActions.setAccountArchived(i, false)
  }

  onClickImport = () => {
    this.props.modalActions.showModal('ImportBtcAddress', {
      origin: 'SettingsPage'
    })
  }

  render() {
    const { data, search, walletsWithoutRemoteData, ...rest } = this.props

    return data.cata({
      Success: value => (
        <Template
          wallets={value}
          search={search && search.toLowerCase()}
          onUnarchive={this.onUnarchive}
          onClickImport={this.onClickImport}
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
          onClickImport={this.onClickImport}
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

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = { context: any } & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(BtcWalletsContainer)
