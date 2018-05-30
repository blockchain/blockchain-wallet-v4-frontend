import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UsedAddressesTable from './template'

class UsedAddressesTableContainer extends React.PureComponent {
  componentWillMount () {
    this.props.componentActions.fetchUsedAddresses(this.props.walletIndex)
  }

  render () {
    const { usedAddresses } = this.props

    return (
      usedAddresses.cata({
        Success: (value) => <UsedAddressesTable usedAddresses={value} />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div/>,
        NotAsked: () => <div/>
      })
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  usedAddresses: selectors.components.usedAddresses.getWalletUsedAddresses(state, ownProps.walletIndex)
})

const mapDispatchToProps = (dispatch) => ({
  componentActions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesTableContainer)
