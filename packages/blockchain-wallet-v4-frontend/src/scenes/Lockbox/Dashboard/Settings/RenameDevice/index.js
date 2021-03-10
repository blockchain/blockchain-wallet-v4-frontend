import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector, SubmissionError } from 'redux-form'

import { actions, selectors } from 'data'
import { requireUniqueDeviceName } from 'services/forms'

import RenameDevice from './template'

class RenameDeviceContainer extends React.PureComponent {
  state = { updateToggled: false }

  onSubmit = () => {
    const { newDeviceName } = this.props
    const isNotUnique = requireUniqueDeviceName(
      newDeviceName,
      this.props.usedDeviceNames
    )
    if (isNotUnique) {
      throw new SubmissionError({
        newDeviceName: isNotUnique
      })
    } else {
      this.props.lockboxActions.updateDeviceName(
        this.props.deviceIndex,
        newDeviceName
      )
      this.handleToggle()
    }
  }

  handleToggle = () => {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  handleCancel = () => {
    this.props.formActions.reset('RenameDevice')
    this.handleToggle()
  }

  render() {
    return (
      <RenameDevice
        {...this.props}
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        handleCancel={this.handleCancel}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  deviceName: selectors.core.kvStore.lockbox
    .getDeviceName(state, ownProps.deviceIndex)
    .getOrFail(),
  usedDeviceNames: selectors.core.kvStore.lockbox
    .getDevices(state)
    .getOrElse([])
    .map(d => d.device_name),
  newDeviceName: formValueSelector('RenameDevice')(state, 'newDeviceName')
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.core.kvStore.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenameDeviceContainer)
