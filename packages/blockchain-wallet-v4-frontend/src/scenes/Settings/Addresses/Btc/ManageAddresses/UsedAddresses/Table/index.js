import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import UsedAddressesTable from './template'

class UsedAddressesTableContainer extends React.PureComponent {
  componentWillMount () {
    this.props.componentActions.fetchUsedAddresses(this.props.walletIndex)
  }

  render () {
    const { usedAddresses, search } = this.props

    return !usedAddresses ? null : usedAddresses.cata({
      Success: (value) => <UsedAddressesTable usedAddresses={value} search={search} />,
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div/>,
      NotAsked: () => <div/>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  search: formValueSelector('manageAddresses')(state, 'search'),
  usedAddresses: selectors.components.usedAddresses.getWalletUsedAddresses(state, ownProps.walletIndex)
})

const mapDispatchToProps = (dispatch) => ({
  componentActions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesTableContainer)
