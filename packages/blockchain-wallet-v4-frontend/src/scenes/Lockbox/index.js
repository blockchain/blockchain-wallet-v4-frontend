import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
  }

  launchCarbonSetup () {
    this.props.modalActions.showModal('LockboxSetup')
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxContainer)
