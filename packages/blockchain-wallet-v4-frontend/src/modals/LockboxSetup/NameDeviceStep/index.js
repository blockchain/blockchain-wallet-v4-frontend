import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getDeviceNames } from './selectors'

import NameDeviceStep from './template'
import { formValueSelector } from 'redux-form'

class NameDeviceStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.setNewDeviceName(this.props.newDeviceName)
    this.props.lockboxActions.changeDeviceSetupStep('confirm-recovery')
  }

  render () {
    const { deviceNames } = this.props

    return (
      <NameDeviceStep
        onSubmit={this.onSubmit}
        initialValues={{
          newDeviceName: `My Lockbox ${deviceNames.length + 1}`
        }}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  newDeviceName: formValueSelector('lockboxNameDevice')(state, 'newDeviceName'),
  deviceNames: getDeviceNames(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameDeviceStepContainer)
