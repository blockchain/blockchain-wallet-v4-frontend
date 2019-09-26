import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model } from 'data'
import { getData } from './selectors'
import Wallets from './template'
import { formValueSelector } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'
const { WALLET_TX_SEARCH } = model.form
const { WALLET_EVENTS } = model.analytics
const {
  ARCHIVE,
  CHANGE_DEFAULT,
  EDIT_NAME,
  SHOW_XPUB,
  UNARCHIVE
} = WALLET_EVENTS

class BchWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render () {
    const {
      addressesBchActions,
      analyticsActions,
      data,
      kvStoreBchActions,
      modalsActions,
      search,
      ...rest
    } = this.props

    const onEditBchAccountLabel = account => {
      addressesBchActions.editBchAccountLabel(account.index, account.label)
      analyticsActions.logEvent(EDIT_NAME)
    }
    const onShowChangeAddrs = account => {
      addressesBchActions.showChangeAddrs(account.index, account.xpub)
    }
    const onShowXPub = account => {
      modalsActions.showModal('ShowXPub', { xpub: account.xpub })
      analyticsActions.logEvent(SHOW_XPUB)
    }
    const onMakeDefault = account => {
      kvStoreBchActions.setDefaultAccountIdx(account.index)
      analyticsActions.logEvent(CHANGE_DEFAULT)
    }
    const onSetArchived = (account, archived) => {
      kvStoreBchActions.setAccountArchived(account.index, archived)
      archived
        ? analyticsActions.logEvent(ARCHIVE)
        : analyticsActions.logEvent(UNARCHIVE)
    }
    const props = {
      onEditBchAccountLabel,
      onShowChangeAddrs,
      onMakeDefault,
      onSetArchived,
      onShowXPub
    }

    return data.cata({
      Success: value => (
        <Wallets
          search={search && search.toLowerCase()}
          data={value}
          {...props}
          {...rest}
        />
      ),
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  kvStoreBchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  addressesBchActions: bindActionCreators(
    actions.modules.addressesBch,
    dispatch
  ),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BchWalletsContainer)
