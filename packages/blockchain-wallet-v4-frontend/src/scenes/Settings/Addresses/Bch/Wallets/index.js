import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'

import { getData } from './selectors'
import Wallets from './template'

const { WALLET_TX_SEARCH } = model.form

class BchWalletsContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render() {
    const {
      addressesBchActions,
      data,
      kvStoreBchActions,
      modalsActions,
      search,
      ...rest
    } = this.props

    const onEditBchAccountLabel = (account) => {
      addressesBchActions.editBchAccountLabel(account.index, account.label)
    }
    const onShowChangeAddrs = (account) => {
      addressesBchActions.showChangeAddrs(account.index, account.xpub)
    }
    const onShowXPub = (account) => {
      modalsActions.showModal('SHOW_XPUB_MODAL', { xpub: account.xpub })
    }
    const onShowFundRecovery = (account) => {
      modalsActions.showModal('FUND_RECOVERY_MODAL', { accountIndex: account.index, coin: 'BCH' })
    }
    const onMakeDefault = (account) => {
      kvStoreBchActions.setDefaultAccountIdx(account.index)
    }
    const onSetArchived = (account, archived) => {
      kvStoreBchActions.setAccountArchived(account.index, archived)
    }
    const props = {
      onEditBchAccountLabel,
      onMakeDefault,
      onSetArchived,
      onShowChangeAddrs,
      onShowFundRecovery,
      onShowXPub
    }

    return data.cata({
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />,
      Success: (value) => (
        <Wallets search={search && search.toLowerCase()} data={value} {...props} {...rest} />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

const mapDispatchToProps = (dispatch) => ({
  addressesBchActions: bindActionCreators(actions.modules.addressesBch, dispatch),
  kvStoreBchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BchWalletsContainer)
