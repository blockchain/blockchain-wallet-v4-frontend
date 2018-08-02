import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keysIn } from 'ramda'

import { actions } from 'data'
import Lockbox from './template.js'
import { getData } from './selectors'

class LockboxContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      connecting: false,
      deviceInfo: {},
      error: false
    }
    this.launchCarbonSetup = this.launchCarbonSetup.bind(this)
    this.deleteDevice = this.deleteDevice.bind(this)
  }

  launchCarbonSetup () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  deleteDevice () {
    // TODO: clean up
    const data = this.props.data.getOrElse({})
    this.props.lockboxActions.deleteDevice(keysIn(data.devices)[0])
  }

  render () {
    const { devices, balances } = this.props.data.cata({
      Success: val => val,
      Loading: () => ({}),
      NotAsked: () => ({}),
      Failure: () => ({})
    })
    return (
      <Lockbox
        deleteDevice={this.deleteDevice}
        launchCarbonSetup={this.launchCarbonSetup}
        balances={balances}
        devices={devices}
        {...this.state}
      />
    )
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
