import React from 'react'
import { actions, selectors } from 'data'
import { connect } from 'react-redux'
import { formValueSelector, SubmissionError } from 'redux-form'
import { bindActionCreators } from 'redux'

import { requireUniqueDeviceName } from 'services/FormHelper'
import RenameDevice from './template.js'

class RenameDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { updateToggled: false }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCancel = this.handleToggle.bind(this)
  }

  onSubmit () {
    const isNotUnique = requireUniqueDeviceName(
      this.props.newDeviceName,
      this.props.usedDeviceNames
    )
    if (isNotUnique) {
      throw new SubmissionError({
        newDeviceName: isNotUnique
      })
    } else {
      this.props.lockboxActions.updateDeviceName(
        this.props.deviceIndex,
        this.props.newDeviceName
      )
      this.handleToggle()
    }
  }

  handleToggle () {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  handleCancel () {
    this.props.formActions.reset('RenameDevice')
    this.handleToggle()
  }

  render () {
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
