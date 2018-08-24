import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keysIn } from 'ramda'

import { actions } from 'data'
import Setup from './Setup'
import Dashboard from './Dashboard'
import { getData } from './selectors'

class LockboxContainer extends React.PureComponent {
  render () {
    // TODO: probably should check for connected device, else fallback to first device in kvStore with stored xpubs
    return this.props.data.cata({
      Success: value =>
        keysIn(value.devices).length ? (
          <Dashboard devices={value.devices} balances={value.balances} />
        ) : (
          <Setup />
        ),
      Loading: () => null,
      NotAsked: () => null,
      Failure: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxContainer)
