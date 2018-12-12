import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import { getData } from './selectors'
import Wallets from './template'
import { Remote } from 'blockchain-wallet-v4/src'

class BsvWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render () {
    const { search } = this.props
    return this.props.data.cata({
      Success: value => (
        <Wallets search={search && search.toLowerCase()} data={value} />
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
  addressesBchActions: bindActionCreators(
    actions.modules.addressesBch,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvWalletsContainer)
