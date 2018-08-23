import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { updateToggled: false }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCancel = this.handleToggle.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.updateDeviceName(
      this.props.deviceId,
      this.props.deviceName
    )
    this.handleToggle()
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
      <Settings
        {...this.props}
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        handleCancel={this.handleCancel}
      />
    )
  }
}

const mapStateToProps = state => ({
  deviceName: formValueSelector('RenameDevice')(state, 'DeviceName')
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.core.kvStore.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
