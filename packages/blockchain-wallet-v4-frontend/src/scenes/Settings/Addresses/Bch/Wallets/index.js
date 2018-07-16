import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData } from './selectors'
import Success from './template.success'
import { formValueSelector } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'

class BchWalletsContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render() {
    const {
      data,
      search,
      addressesBchActions,
      kvStoreBchActions,
      modalsActions,
      ...rest
    } = this.props

    const onEditBchAccountLabel = account =>
      addressesBchActions.editBchAccountLabel(account.index, account.label)
    const onShowXPub = account =>
      modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    const onMakeDefault = account =>
      kvStoreBchActions.setDefaultAccountIdx(account.index)

    const onSetArchived = (account, archived) => {
      kvStoreBchActions.setAccountArchived(account.index, archived)
    }

    const props = {
      onEditBchAccountLabel,
      onShowXPub,
      onMakeDefault,
      onSetArchived
    }

    return data.cata({
      Success: value => (
        <Success
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
  search: formValueSelector('settingsAddresses')(state, 'search')
})

const mapDispatchToProps = dispatch => ({
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
