import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, model } from 'data'
import { getData, getWalletsWithoutRemoteData } from './selectors'
import Template from './template'
import { Remote } from 'blockchain-wallet-v4/src'

const { WALLET_TX_SEARCH } = model.form
const { ADD_NEW, UNARCHIVE } = model.analytics.WALLET_EVENTS

class BitcoinWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onAddNewWallet = value => {
    this.props.modalActions.showModal('AddBtcWallet', { wallets: value })
    this.props.analyticsActions.logEvent(ADD_NEW)
  }

  onUnarchive = i => {
    this.props.coreActions.setAccountArchived(i, false)
    this.props.analyticsActions.logEvent(UNARCHIVE)
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search'),
  walletsWithoutRemoteData: getWalletsWithoutRemoteData(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BitcoinWalletsContainer)
