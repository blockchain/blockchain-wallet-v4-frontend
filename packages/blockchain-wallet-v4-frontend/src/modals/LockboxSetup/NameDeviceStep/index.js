import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import NameDeviceStep from './template'
import { formValueSelector } from 'redux-form'

class NameDeviceStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.saveNewDeviceKvStore(this.props.newDeviceName)
  }

  render () {
    const { usedDeviceNames } = this.props
    const deviceIndex =
      usedDeviceNames.length > 0 ? ` ${usedDeviceNames.length + 1}` : ''

    return (
      <NameDeviceStep
        onSubmit={this.onSubmit}
        initialValues={{
          newDeviceName: 'My Lockbox Device' + deviceIndex
        }}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  newDeviceName: formValueSelector('lockboxNameDevice')(state, 'newDeviceName'),
  usedDeviceNames: selectors.core.kvStore.lockbox
    .getDevices(state)
    .getOrElse([])
    .map(d => d.device_name)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameDeviceStepContainer)
